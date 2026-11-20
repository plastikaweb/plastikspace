#!/usr/bin/env node
/**
 * META-11 — lint gate for the eco task docs. `yarn tasks:check` runs it
 * together with `sync-eco-store-tasks.cjs --all --offline`, which reports
 * the same task carrying different statuses in two places.
 *
 * Read-only. The docs come from tools/scripts/task-homes.json: each home's
 * tasks doc, its companions and its specs. Errors:
 *   - table rules MD055, MD056 and MD058 (an unescaped `|` changes the
 *     column count, so MD056 catches it). The repo-wide markdownlint config
 *     ignores these docs, so the library runs here with only these rules;
 *   - blank-row: a blank line between two rows of one table, which splits it
 *     and turns the rest into a paragraph no table rule looks at;
 *   - version-mismatch: inside one home, the tasks doc and its companions
 *     that declare a "**Document version:**" must declare the same one.
 *     Specs keep their own version.
 * A configured doc that does not exist is a notice, not an error.
 *
 * Usage:
 *   node tools/scripts/check-task-docs.cjs
 *   node tools/scripts/check-task-docs.cjs --root <dir> --config <file>
 *
 * Exit codes: 0 clean; 1 one or more errors; 2 usage or IO error.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_CONFIG_PATH = path.join(__dirname, 'task-homes.json');
const TABLE_RULES = { default: false, MD055: true, MD056: true, MD058: true };
const VERSION_RE = /^\*\*Document version:\*\*\s*([0-9][0-9.]*[0-9])/;
const ROW_RE = /^\s*\|/;
const SEPARATOR_RE = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const FENCE_RE = /^\s*(```|~~~)/;

class UsageError extends Error {}

function parseArgs(argv) {
  const args = { root: REPO_ROOT, config: DEFAULT_CONFIG_PATH };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      const next = argv[++i];
      if (next === undefined || next.startsWith('--')) throw new UsageError(`${arg} needs a value`);

      return next;
    };
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--root') args.root = path.resolve(value());
    else if (arg === '--config') args.config = path.resolve(value());
    else throw new UsageError(`unknown argument ${arg}`);
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node tools/scripts/check-task-docs.cjs [options]

  --root <dir>     Repository root (default: this repo).
  --config <file>  task-homes.json to use.

Checks every doc in task-homes.json: table rules MD055/MD056/MD058, blank
lines between table rows, and one "Document version" per home (tasks doc and
companions). Exit codes: 0 clean; 1 errors; 2 usage or IO error.`);
}

/**
 * Lists every configured doc once, with its home and role.
 * @param {object} config Parsed task-homes.json.
 * @returns {{home: string, rel: string, role: string}[]} The docs, tasks doc first in each home.
 */
function listDocs(config) {
  const seen = new Set();
  const docs = [];
  for (const home of config.homes) {
    const entries = [
      [home.tasks, 'tasks'],
      ...(home.companions ?? []).map(rel => [rel, 'companion']),
      ...(home.specs ?? []).map(rel => [rel, 'spec']),
    ];
    for (const [rel, role] of entries) {
      if (seen.has(rel)) continue;
      seen.add(rel);
      docs.push({ home: home.key, rel, role });
    }
  }

  return docs;
}

/**
 * Finds table rows separated by a blank line. A row after the blank that is
 * the header of a new table (the next line is a separator) is not flagged;
 * neither is anything inside a code fence.
 * @param {string[]} lines The doc's lines.
 * @returns {{line: number, detail: string}[]} One entry per split, 1-based line of the row after the blank.
 */
function findBlankRows(lines) {
  const found = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (FENCE_RE.test(lines[i])) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !ROW_RE.test(lines[i])) continue;
    let previous = i - 1;
    while (previous >= 0 && lines[previous].trim() === '') previous--;
    const hasBlank = previous < i - 1;
    const isAfterRow = previous >= 0 && ROW_RE.test(lines[previous]);
    const isNewTable = SEPARATOR_RE.test(lines[i + 1] ?? '');
    if (hasBlank && isAfterRow && !isNewTable) {
      const blanks = previous + 2 === i ? `line ${i}` : `lines ${previous + 2}-${i}`;
      found.push({ line: i + 1, detail: `blank ${blanks} split a table; delete them` });
    }
  }

  return found;
}

/**
 * Reads the "**Document version:**" a doc declares, if any.
 * @param {string[]} lines The doc's lines.
 * @returns {{version: string, line: number} | null} The version and its 1-based line.
 */
function readVersion(lines) {
  for (let i = 0; i < lines.length; i++) {
    const match = VERSION_RE.exec(lines[i]);
    if (match) return { version: match[1], line: i + 1 };
  }

  return null;
}

/**
 * Compares the declared versions of the tasks doc and companions of each home.
 * @param {object[]} docs Read docs ({home, rel, role, lines}).
 * @returns {object[]} One version-mismatch error per doc that differs from its home's tasks doc.
 */
function checkVersions(docs) {
  const errors = [];
  const byHome = new Map();
  for (const doc of docs) {
    if (doc.role === 'spec') continue;
    const declared = readVersion(doc.lines);
    if (!declared) continue;
    if (!byHome.has(doc.home)) byHome.set(doc.home, []);
    byHome.get(doc.home).push({ doc, ...declared });
  }
  for (const entries of byHome.values()) {
    const reference = entries.find(entry => entry.doc.role === 'tasks') ?? entries[0];
    for (const entry of entries) {
      if (entry.version === reference.version) continue;
      errors.push({
        rel: entry.doc.rel,
        line: entry.line,
        rule: 'version-mismatch',
        detail: `Document version ${entry.version}, but ${reference.doc.rel} says ${reference.version}; bump both together`,
      });
    }
  }

  return errors;
}

async function lintTables(root, docs) {
  const { lint } = await import('markdownlint/promise');
  const files = docs.map(doc => path.join(root, doc.rel));
  const results = await lint({ files, config: TABLE_RULES });
  const errors = [];
  for (const doc of docs) {
    for (const issue of results[path.join(root, doc.rel)] ?? []) {
      const rule = issue.ruleNames.slice(0, 2).join('/');
      const detail = [issue.ruleDescription, issue.errorDetail].filter(Boolean).join(': ');
      errors.push({ rel: doc.rel, line: issue.lineNumber, rule, detail });
    }
  }

  return errors;
}

/**
 * Runs every check over the configured docs.
 * @param {object} args {root, config}.
 * @returns {Promise<{errors: object[], missing: string[]}>} Errors sorted by file and line, and the docs not found.
 */
async function run(args) {
  let config;
  try {
    config = JSON.parse(fs.readFileSync(args.config, 'utf8'));
  } catch (err) {
    throw new UsageError(`config ${args.config}: ${err.message}`);
  }
  if (!Array.isArray(config.homes)) throw new UsageError(`config ${args.config}: homes[] missing`);
  const docs = [];
  const missing = [];
  for (const doc of listDocs(config)) {
    const file = path.join(args.root, doc.rel);
    if (!fs.existsSync(file)) {
      missing.push(doc.rel);
      continue;
    }
    docs.push({ ...doc, lines: fs.readFileSync(file, 'utf8').split(/\r?\n/) });
  }
  const errors = [
    ...(await lintTables(args.root, docs)),
    ...docs.flatMap(doc =>
      findBlankRows(doc.lines).map(found => ({ rel: doc.rel, rule: 'blank-row', ...found }))
    ),
    ...checkVersions(docs),
  ].sort((a, b) => a.rel.localeCompare(b.rel) || a.line - b.line);

  return { errors, missing, checked: docs.length };
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      printHelp();

      return 0;
    }
    const { errors, missing, checked } = await run(args);
    missing.forEach(rel => console.log(`· ${rel}: not found, skipped`));
    errors.forEach(err => console.log(`${err.rel}:${err.line}  ${err.rule}  ${err.detail}`));
    if (errors.length) {
      console.log(`✗ ${errors.length} error(s) in the task docs`);

      return 1;
    }
    console.log(`✓ ${checked} task doc(s) clean`);

    return 0;
  } catch (err) {
    console.error(`✗ ${err.message}`);
    if (err instanceof UsageError) console.error('  Run with --help for usage.');

    return 2;
  }
}

if (require.main === module) main().then(code => (process.exitCode = code));

module.exports = { run, parseArgs, listDocs, findBlankRows, readVersion, checkVersions };
