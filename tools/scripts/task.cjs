#!/usr/bin/env node
/**
 * META-10 — prints one task from the eco task docs, so nobody has to read a
 * 200 KB TASKS.md to find it.
 *
 * Read-only. A definition is a level 2–4 heading that opens with the ID (the
 * block runs to the next heading of the same or higher level), a "- **ID**"
 * bullet (with its indented children) or a table row with the ID in its key
 * column. Companion docs never define. Every other line that names the task
 * is a mention. Docs come from tools/scripts/task-homes.json: each home's
 * tasks doc, its companions and its specs. Missing docs are skipped and named.
 *
 * Usage:
 *   node tools/scripts/task.cjs AREF-04
 *   node tools/scripts/task.cjs 123kjkdp4kx
 *   node tools/scripts/task.cjs 0.7 --home eco-admin
 *   node tools/scripts/task.cjs PRV-08 --full --ref origin/develop
 *
 * Exit codes: 0 a definition was printed; 2 no definition (mentions or
 * similar IDs are listed instead); 1 usage or IO error.
 */

const path = require('path');
const {
  parseTasksText,
  extractCuIds,
  scanIds,
  buildGrammar,
  splitRow,
  readDoc,
  loadConfig,
} = require('./sync-eco-store-tasks.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_CONFIG_PATH = path.join(__dirname, 'task-homes.json');
const CELL_LIMIT = 1500;
const MENTION_LIMIT = 200;
const MAX_MENTIONS = 8;
const MAX_LISTED_MENTIONS = 12;
const MAX_SUGGESTIONS = 5;
const SIMILARITY_CUTOFF = 0.6;
const CU_ARG_RE = /^(86[a-z0-9]{7}|123[a-z0-9]{8})$/;
const LABEL_ARG_RE = /^\d+(\.\d+)+[a-z]?$/;
const DEFINITION_SHAPES = new Set(['heading', 'table', 'bullet']);

class UsageError extends Error {}

function parseArgs(argv) {
  const args = { root: REPO_ROOT, config: DEFAULT_CONFIG_PATH, home: null, ref: null, full: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      const next = argv[++i];
      if (next === undefined || next.startsWith('--')) throw new UsageError(`${arg} needs a value`);

      return next;
    };
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--full') args.full = true;
    else if (arg === '--root') args.root = path.resolve(value());
    else if (arg === '--config') args.config = path.resolve(value());
    else if (arg === '--home') args.home = value();
    else if (arg === '--ref') args.ref = value();
    else if (arg.startsWith('--')) throw new UsageError(`unknown option ${arg}`);
    else positional.push(arg);
  }
  if (!args.help && positional.length !== 1) throw new UsageError('give exactly one task ID');
  args.query = positional[0];

  return args;
}

function printHelp() {
  console.log(`Usage: node tools/scripts/task.cjs <ID> [options]

  <ID>             Task ID (AREF-04, any case), ClickUp ID (123kjkdp4kx) or
                   row label (0.7, needs --home).
  --home <key>     Only read this home's docs (eco-store, eco-admin…).
  --ref <ref>      Read the docs from a git ref instead of the working tree.
  --full           Print long cells and lines whole (default: clip at ${CELL_LIMIT}).
  --root <dir>     Repository root (default: this repo).
  --config <file>  task-homes.json to use.

Exit codes: 0 definition found; 2 only mentions or nothing; 1 usage or IO error.`);
}

// What the argument names: a ClickUp ticket, a row label or a task ID.
function classify(query) {
  const raw = query.trim();
  if (CU_ARG_RE.test(raw)) return { kind: 'cu', value: raw, display: raw };
  if (LABEL_ARG_RE.test(raw)) return { kind: 'label', value: raw, display: raw };

  return { kind: 'id', value: raw.toLowerCase(), display: raw.toUpperCase() };
}

function collectDocs(config, args) {
  const homes = args.home ? config.homes.filter(home => home.key === args.home) : config.homes;
  if (!homes.length) throw new UsageError(`unknown home ${args.home}`);
  const docs = [];
  const missing = [];
  const seen = new Set();
  const push = (home, rel, role) => {
    if (seen.has(rel)) return;
    seen.add(rel);
    const text = readDoc(args.root, args.ref, rel);
    if (text === null) missing.push(rel);
    else docs.push({ home: home.key, rel, role, text, lines: text.split(/\r?\n/) });
  };
  for (const home of homes) {
    push(home, home.tasks, 'tasks');
    (home.companions ?? []).forEach(rel => push(home, rel, 'companion'));
    (home.specs ?? []).forEach(rel => push(home, rel, 'spec'));
  }

  return { docs, missing };
}

function matches(occurrence, target) {
  if (target.kind === 'cu') return occurrence.cuIds.includes(target.value);
  if (target.kind === 'label') {
    return occurrence.shape === 'table' && occurrence.label.split(/\s+/)[0] === target.value;
  }

  return occurrence.taskIds.some(id => id.toLowerCase() === target.value);
}

// A heading block runs to the next heading of the same or higher level, minus
// trailing blank lines and a closing horizontal rule.
function headingEnd(lines, start) {
  const level = lines[start - 1].trim().match(/^#+/)[0].length;
  let fence = false;
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) fence = !fence;
    const m = !fence && lines[i].trim().match(/^(#{1,6})\s/);
    if (m && m[1].length <= level) {
      end = i;
      break;
    }
  }
  while (end > start && /^\s*(-{3,}|\*{3,})?\s*$/.test(lines[end - 1])) end -= 1;

  return end;
}

// A "- **ID** …" bullet runs over the lines indented deeper than it.
function bulletEnd(lines, start) {
  const indent = lines[start - 1].match(/^\s*/)[0].length;
  let end = start;
  for (let i = start; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    if (lines[i].match(/^\s*/)[0].length <= indent) break;
    end = i + 1;
  }

  return end;
}

// The table header above a row: the first line of its run of table lines.
function tableHeader(lines, line) {
  let i = line - 1;
  while (i > 0 && lines[i - 1].trim().startsWith('|')) i -= 1;

  return splitRow(lines[i].trim());
}

function findDefinitions(docs, target, grammar, config) {
  const definitions = [];
  for (const doc of docs) {
    if (doc.role === 'companion') continue;
    const parsed = parseTasksText(doc.text, {
      grammar,
      home: doc.home,
      doc: doc.rel,
      excludedFamilies: config.excludedFamilies,
    });
    for (const occurrence of parsed.occurrences) {
      if (!DEFINITION_SHAPES.has(occurrence.shape)) continue;
      if (target.kind === 'label' && doc.role !== 'tasks') continue;
      if (!matches(occurrence, target)) continue;
      const start = occurrence.line;
      const end =
        occurrence.shape === 'heading'
          ? headingEnd(doc.lines, start)
          : occurrence.shape === 'bullet'
            ? bulletEnd(doc.lines, start)
            : start;
      definitions.push({ doc, occurrence, start, end });
    }
  }

  return definitions;
}

function namesTarget(text, target, grammar) {
  if (target.kind === 'cu') return extractCuIds(text).includes(target.value);
  if (target.kind === 'label') return false;

  return scanIds(text, grammar).some(token =>
    token.ids.some(id => id.toLowerCase() === target.value)
  );
}

function findMentions(docs, target, grammar, definitions) {
  const inside = (doc, line) =>
    definitions.some(def => def.doc === doc && line >= def.start && line <= def.end);
  const mentions = [];
  for (const doc of docs) {
    let fence = false;
    doc.lines.forEach((text, index) => {
      if (/^\s*(```|~~~)/.test(text)) fence = !fence;
      const line = index + 1;
      if (inside(doc, line) || !namesTarget(text, target, grammar)) return;
      mentions.push({ doc, line, text, fence });
    });
  }

  return mentions;
}

function clip(text, limit, full) {
  if (full || text.length <= limit) return text;

  return `${text.slice(0, limit)}… (+${text.length - limit} chars, --full)`;
}

function rangeOf(def) {
  return def.start === def.end ? `${def.start}` : `${def.start}-${def.end}`;
}

function formatDefinition(def, full) {
  const { doc, occurrence, start, end } = def;
  if (occurrence.shape !== 'table') {
    return doc.lines
      .slice(start - 1, end)
      .map(text => clip(text, CELL_LIMIT, full))
      .join('\n');
  }
  const header = tableHeader(doc.lines, start);
  const cells = splitRow(doc.lines[start - 1].trim());
  const width = Math.max(...header.map(cell => cell.length));

  return cells
    .map((cell, i) => {
      const name = (header[i] ?? `col ${i + 1}`).padEnd(width);

      return `${name} : ${clip(cell, CELL_LIMIT, full)}`;
    })
    .join('\n');
}

function formatMention(mention, full) {
  const flat = mention.text.trim().replace(/\s+/g, ' ');

  return `${mention.doc.rel}:${mention.line}: ${clip(flat, MENTION_LIMIT, full)}`;
}

// Ratcliff/Obershelp-style ratio, the measure difflib.get_close_matches uses.
function similarity(a, b) {
  const longest = (x, y) => {
    let best = { len: 0, i: 0, j: 0 };
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < y.length; j++) {
        let k = 0;
        while (i + k < x.length && j + k < y.length && x[i + k] === y[j + k]) k += 1;
        if (k > best.len) best = { len: k, i, j };
      }
    }

    return best;
  };
  const matched = (x, y) => {
    const m = longest(x, y);
    if (!m.len) return 0;

    return (
      m.len +
      matched(x.slice(0, m.i), y.slice(0, m.j)) +
      matched(x.slice(m.i + m.len), y.slice(m.j + m.len))
    );
  };

  return a.length + b.length ? (2 * matched(a, b)) / (a.length + b.length) : 0;
}

function suggest(docs, target, grammar) {
  if (target.kind !== 'id') return [];
  const ids = new Set();
  for (const doc of docs)
    scanIds(doc.text, grammar).forEach(token => token.ids.forEach(id => ids.add(id)));

  return [...ids]
    .map(id => ({ id, score: similarity(target.value, id.toLowerCase()) }))
    .filter(entry => entry.score >= SIMILARITY_CUTOFF)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, MAX_SUGGESTIONS)
    .map(entry => entry.id);
}

/**
 * Looks a task up and renders the report.
 * @param {object} args Parsed CLI arguments.
 * @returns {{code: number, text: string}} Exit code and report.
 */
function run(args) {
  const config = loadConfig(args.config);
  const grammar = buildGrammar(config.idFamilies);
  const target = classify(args.query);
  if (target.kind === 'label' && !args.home) {
    throw new UsageError(`row label ${target.value} needs --home (labels repeat across docs)`);
  }
  const { docs, missing } = collectDocs(config, args);
  const definitions = findDefinitions(docs, target, grammar, config);
  const mentions = findMentions(docs, target, grammar, definitions);
  const out = [];

  if (!definitions.length) {
    if (mentions.length) {
      out.push(`${target.display}: no definition; named in ${mentions.length} line(s):`);
      mentions.slice(0, MAX_MENTIONS).forEach(m => out.push(`  ${formatMention(m, args.full)}`));
      if (mentions.length > MAX_MENTIONS)
        out.push(`  … and ${mentions.length - MAX_MENTIONS} more`);
    } else {
      const similar = suggest(docs, target, grammar);
      out.push(
        `${target.display}: not found in ${docs.map(doc => doc.rel).join(', ') || 'any doc'}.`
      );
      if (similar.length) out.push(`Similar IDs: ${similar.join(', ')}`);
    }
    if (missing.length)
      out.push(`Skipped (not found${args.ref ? ` at ${args.ref}` : ''}): ${missing.join(', ')}`);

    return { code: 2, text: out.join('\n') };
  }

  for (const def of definitions) {
    const lines = def.end - def.start + 1;
    out.push(
      `${target.display} · ${def.doc.rel}:${rangeOf(def)} (${def.occurrence.shape}, ${lines} line${lines === 1 ? '' : 's'})`
    );
  }
  if (mentions.length) {
    const shown = args.full ? mentions : mentions.slice(0, MAX_LISTED_MENTIONS);
    out.push(`Also named in ${mentions.length} line(s):`);
    shown.forEach(m => out.push(`  ${formatMention(m, args.full)}`));
    if (shown.length < mentions.length) {
      out.push(`  … and ${mentions.length - shown.length} more (--full lists them all)`);
    }
  }
  for (const def of definitions) {
    out.push('---', `${def.doc.rel}:${rangeOf(def)}`, formatDefinition(def, args.full));
  }

  return { code: 0, text: out.join('\n') };
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      printHelp();

      return 0;
    }
    const { code, text } = run(args);
    console.log(text);

    return code;
  } catch (err) {
    console.error(`✗ ${err.message}`);
    if (err instanceof UsageError) console.error('  Run with --help for usage.');

    return 1;
  }
}

if (require.main === module) process.exitCode = main();

module.exports = { run, parseArgs, classify, similarity };
