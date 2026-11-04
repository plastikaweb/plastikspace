#!/usr/bin/env node
/**
 * META-05 / META-07 — ClickUp ↔ TASKS.md drift check across task homes.
 *
 * Read-only. A task home pairs one ClickUp list with one TASKS doc (plus
 * companion docs that may only hold referrals); the pairs live in
 * tools/scripts/task-homes.json. For each selected home the report lists rows
 * only in the doc, tickets only in ClickUp, status mismatches and link
 * problems, then doc-consistency issues across homes. No writes.
 *
 * Usage:
 *   CLICKUP_API_TOKEN=pk_... node tools/scripts/sync-eco-store-tasks.cjs
 *   CLICKUP_API_TOKEN=pk_... node tools/scripts/sync-eco-store-tasks.cjs --all --ref origin/develop
 *   node tools/scripts/sync-eco-store-tasks.cjs --all --offline
 *   node tools/scripts/sync-eco-store-tasks.cjs --home eco-admin --clickup-fixture tickets.json --json
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_CONFIG_PATH = path.join(__dirname, 'task-homes.json');
const DEFAULT_HOME = 'eco-store';
const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2';
const BRIDGE_THRESHOLD = 0.5;

// Status symbols → coarse bucket. Done/dropped ↔ closed, every other state ↔
// open. Headings (### Done ✅) cascade to content without its own symbol.
const STATUS_BUCKETS = {
  '✅': 'closed',
  '❌': 'closed',
  '🔄': 'open',
  '📋': 'open',
  '🧪': 'open',
  '⛔': 'open',
  '⏸': 'open',
  '❓': 'open',
};
const STATUS_EMOJI_RE = /✅|❌|🔄|📋|🧪|⛔|⏸|❓/u;
const STATUS_WORDS = [
  [/^(done|closed|complete|completed)\b/i, 'closed'],
  [/^(open|pending|in progress|blocked|deferred|ready)\b/i, 'open'],
];

// ClickUp IDs only count inside backticks: legacy `86c…` (9 chars) and newer
// `123…` (11 chars). Pinned lengths keep short git SHAs out.
const CU_ID_RE = /`(86(?=[a-z0-9]*[a-z])[a-z0-9]{7}|123(?=[a-z0-9]*[a-z])[a-z0-9]{8})`/g;

// What may sit between the IDs of one leading run (key cells, headings, bold
// bullets) and of a ticket name.
const RUN_GAP_RE = /^[\s/+·,&️✅❌🔄📋🧪⛔⏸❓]*$/u;
const NAME_GAP_RE = /^[\s/+·,&:[\]|-]*$/;

// ID-shaped first token of a key-cell segment, any family (for the
// unrecognized-family warning).
const GENERIC_ID_RE = /^[\s/+·,&]*([A-Z][A-Z0-9]*)-\d{2,3}[a-z]?\b/;

// Sections that never hold task rows (legends, schema notes, changelogs…).
const SKIP_SECTION_RE =
  /^(how to use|status legend|priority|module prefixes|id families|schema changes pending|changelog|outstanding|estimating conventions|effort summary|how to adjust)/i;

// → **<ID>** · `<cu>` · <home> (<doc>)
const REFERRAL_RE = /→\s*\*\*([^*]+)\*\*\s*·\s*`([a-z0-9]+)`\s*·\s*([^(]+?)\s*\(([^)]+)\)/g;

const SOURCE_RANK = { inline: 0, section: 1, default: 2 };
const SHAPE_RANK = { table: 0, heading: 1, bullet: 2, list: 3, pair: 4 };

class UsageError extends Error {}

let defaultGrammarCache = null;

function parseArgs(argv) {
  const args = {
    home: null,
    all: false,
    ref: null,
    offline: false,
    fixture: null,
    json: false,
    root: REPO_ROOT,
    config: DEFAULT_CONFIG_PATH,
    tasksPath: null,
    listId: null,
    verbose: false,
    help: false,
  };
  const valued = {
    '--home': 'home',
    '--ref': 'ref',
    '--clickup-fixture': 'fixture',
    '--root': 'root',
    '--config': 'config',
    '--tasks-path': 'tasksPath',
    '--list-id': 'listId',
  };
  const flags = {
    '--all': 'all',
    '--offline': 'offline',
    '--json': 'json',
    '--verbose': 'verbose',
    '-v': 'verbose',
    '--help': 'help',
    '-h': 'help',
  };
  for (let i = 0; i < argv.length; i++) {
    const [flag, inline] = argv[i].split(/=(.*)/s, 2);
    if (flags[flag] && inline === undefined) {
      args[flags[flag]] = true;
      continue;
    }
    if (!valued[flag]) throw new UsageError(`unknown argument: ${argv[i]}`);
    const value = inline ?? argv[++i];
    if (value === undefined || value === '' || value.startsWith('--')) {
      throw new UsageError(`${flag} needs a value`);
    }
    args[valued[flag]] = value;
  }
  if (args.all && args.home) throw new UsageError('--all and --home are exclusive');
  if (args.all && (args.tasksPath || args.listId)) {
    throw new UsageError('--tasks-path and --list-id apply to one home, not --all');
  }
  if (args.offline && args.fixture) {
    throw new UsageError('--offline and --clickup-fixture are exclusive');
  }
  return args;
}

function printHelp() {
  console.log(`sync-eco-store-tasks — read-only TASKS.md ↔ ClickUp drift check (META-05, META-07)

Options:
  --home <key>              Task home to report (default ${DEFAULT_HOME}; keys in task-homes.json)
  --all                     Report every configured home
  --ref <git-ref>           Read the docs at a git ref (e.g. origin/develop); missing docs are tolerated
  --offline                 Skip ClickUp; doc consistency only (no token needed)
  --clickup-fixture <json>  Use {"<listId>": [tickets]} from a file instead of the API (no token needed)
  --json                    Print the report as JSON
  --root <dir>              Repository root (default: this repo)
  --config <path>           Task-homes config (default tools/scripts/task-homes.json)
  --tasks-path <path>       Override the selected home's TASKS doc (read from disk)
  --list-id <id>            Override the selected home's ClickUp list
  --verbose, -v             Progress on stderr
  --help, -h                This help

Env:
  CLICKUP_API_TOKEN         Personal token (pk_...), required unless --offline or --clickup-fixture

Exit codes: 0 no drift · 1 drift · 2 usage, config, token or doc error · 3 ClickUp fetch failed · 99 unexpected`);
}

/**
 * Reads and validates the task-homes config.
 * @param {string} [configPath] Path to task-homes.json.
 * @returns {{homes: object[], idFamilies: string[], excludedFamilies: string[]}} Config.
 */
function loadConfig(configPath = DEFAULT_CONFIG_PATH) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!Array.isArray(config.homes) || !config.homes.length) throw new Error('homes[] missing');
  if (!Array.isArray(config.idFamilies) || !config.idFamilies.length) {
    throw new Error('idFamilies[] missing');
  }
  for (const home of config.homes) {
    if (!home.key || !home.name || !home.tasks) throw new Error('each home needs key, name, tasks');
    home.companions = home.companions ?? [];
    home.listId = home.listId ?? null;
  }
  config.excludedFamilies = config.excludedFamilies ?? [];
  return config;
}

function escapeRe(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds the task-ID grammar for a family allowlist: family, dash, two or
 * three digits, optional sub-letter (PRV-02b) and optional part (PRV-05b-A).
 * @param {string[]} families Allowed ID families (BOT, MKT-research, B…).
 * @returns {{families: Set<string>, alt: string, idSource: string}} Grammar.
 */
function buildGrammar(families) {
  const alt = [...families]
    .sort((a, b) => b.length - a.length)
    .map(escapeRe)
    .join('|');
  const idSource = `(?<![A-Za-z0-9_-])(${alt})-(\\d{2,3})([a-z]?)((?:-[A-Z](?![A-Za-z0-9_]))?)(?![A-Za-z0-9_])`;

  return { families: new Set(families), alt, idSource };
}

function defaultGrammar() {
  if (!defaultGrammarCache) defaultGrammarCache = buildGrammar(loadConfig().idFamilies);

  return defaultGrammarCache;
}

// Slash lists (B-02/03, BOT-06a/b/c, PRV-05b-A/B) and ranges (SRC-01..09,
// B-20…B-30) that follow an ID. Returns the end of the whole token.
function expandTail(text, start, grammar, parts, ids) {
  const { family, num, letter, suffix } = parts;
  const slashNum = /\/(\d{2,3})([a-z]?)(?![A-Za-z0-9_])/y;
  const slashLetter = /\/([a-z])(?![A-Za-z0-9_])/y;
  const slashPart = /\/([A-Z])(?![A-Za-z0-9_])/y;
  let pos = start;
  for (;;) {
    const re = suffix ? slashPart : letter ? slashLetter : slashNum;
    re.lastIndex = pos;
    let m = re.exec(text);
    if (!m && letter && !suffix) {
      slashNum.lastIndex = pos;
      m = slashNum.exec(text);
      if (m) {
        ids.push(`${family}-${m[1]}${m[2]}`);
        pos = slashNum.lastIndex;
        continue;
      }
    }
    if (!m) break;
    if (suffix) ids.push(`${family}-${num}${letter}-${m[1]}`);
    else if (letter) ids.push(`${family}-${num}${m[1]}`);
    else ids.push(`${family}-${m[1]}${m[2]}`);
    pos = re.lastIndex;
  }
  if (ids.length === 1 && !letter && !suffix) {
    const range = new RegExp(`(?:\\.\\.|…)(?:(${grammar.alt})-)?(\\d{2,3})(?![A-Za-z0-9_])`, 'y');
    range.lastIndex = pos;
    const m = range.exec(text);
    const from = Number(num);
    const to = m ? Number(m[2]) : NaN;
    if (m && (!m[1] || m[1] === family) && to > from && to - from < 100) {
      for (let n = from + 1; n <= to; n++)
        ids.push(`${family}-${String(n).padStart(num.length, '0')}`);
      pos = range.lastIndex;
    }
  }

  return pos;
}

/**
 * Finds task-ID tokens in text, expanding slash lists and ranges.
 * @param {string} text Text to scan.
 * @param {object} [grammar] Grammar from buildGrammar.
 * @returns {{ids: string[], start: number, end: number}[]} Tokens in order.
 */
function scanIds(text, grammar = defaultGrammar()) {
  const re = new RegExp(grammar.idSource, 'g');
  const tokens = [];
  let m;
  while ((m = re.exec(text))) {
    const [, family, num, letter, suffix] = m;
    const ids = [`${family}-${num}${letter}${suffix}`];
    const end = expandTail(
      text,
      m.index + m[0].length,
      grammar,
      { family, num, letter, suffix },
      ids
    );
    re.lastIndex = end;
    tokens.push({ ids, start: m.index, end });
  }

  return tokens;
}

/**
 * Task IDs that open the text: tokens joined only by separators or status
 * symbols. The first word that is neither ends the run.
 * @param {string} text Key cell segment, heading, bold text or ticket name.
 * @param {object} [grammar] Grammar from buildGrammar.
 * @param {RegExp} [gapRe] Allowed text between tokens.
 * @returns {string[]} Leading task IDs.
 */
function leadingRun(text, grammar = defaultGrammar(), gapRe = RUN_GAP_RE) {
  const ids = [];
  let pos = 0;
  for (const token of scanIds(text, grammar)) {
    if (!gapRe.test(text.slice(pos, token.start))) break;
    ids.push(...token.ids);
    pos = token.end;
  }

  return ids;
}

function unique(values) {
  return [...new Set(values)];
}

/**
 * Every task ID in text (PRD ID or admin/shared family), expansions included.
 * @param {string} text Text to scan.
 * @param {object} [grammar] Grammar from buildGrammar.
 * @returns {string[]} Unique IDs in order of appearance.
 */
function extractPrdIds(text, grammar = defaultGrammar()) {
  return unique(scanIds(text, grammar).flatMap(token => token.ids));
}

function extractCuIds(text) {
  return unique([...(text ?? '').matchAll(CU_ID_RE)].map(m => m[1]));
}

/**
 * First backticked ClickUp ID in text.
 * @param {string} text Text to scan.
 * @returns {string|null} ClickUp ID or null.
 */
function extractCuId(text) {
  return extractCuIds(text)[0] ?? null;
}

function earliestStatus(text) {
  const m = (text ?? '').match(STATUS_EMOJI_RE);

  return m ? STATUS_BUCKETS[m[0]] : null;
}

function stripParens(text) {
  let previous;
  let current = text;
  do {
    previous = current;
    current = current.replace(/\([^()]*\)/g, '');
  } while (current !== previous);

  return current;
}

// Status cell: symbol or leading word, ignoring text after "—" and in parens.
function statusFromCell(cell) {
  const core = stripParens((cell ?? '').split('—')[0])
    .replace(/[*_`]/g, '')
    .trim();
  const fromSymbol = earliestStatus(core);
  if (fromSymbol) return fromSymbol;
  for (const [re, bucket] of STATUS_WORDS) if (re.test(core)) return bucket;

  return null;
}

function stripEmoji(text) {
  return text.replace(/[⌀-➿\u{1F000}-\u{1FFFF}️]/gu, '');
}

// Splits a table row on unescaped pipes; the outer pipes are optional.
function splitRow(line) {
  let body = line.trim().replace(/\\\|/g, '\u0000');
  if (body.startsWith('|')) body = body.slice(1);
  if (body.endsWith('|')) body = body.slice(0, -1);

  return body.split('|').map(cell => cell.replace(/\u0000/g, '|').trim());
}

function normalizeHeader(cell) {
  return cell.replace(/[*_`]/g, '').trim().toLowerCase();
}

function tableColumns(header) {
  let key = header.findIndex(cell => cell === 'id' || cell === 'prd id');
  if (key < 0) key = header.indexOf('task');
  if (key < 0) key = header.indexOf('module');

  return {
    key,
    label: header.indexOf('#'),
    cu: header.findIndex(cell => /^(clickup|cu)( id)?$/.test(cell)),
    status: header.indexOf('status'),
    task: header.indexOf('task'),
  };
}

// Key cells list several tasks as "A + B" or "A · B"; parentheses and code
// spans never split.
function splitSegments(cell) {
  const segments = [];
  let current = '';
  let depth = 0;
  let inCode = false;
  for (let i = 0; i < cell.length; i++) {
    const ch = cell[i];
    if (ch === '`') inCode = !inCode;
    else if (!inCode && ch === '(') depth += 1;
    else if (!inCode && ch === ')') depth = Math.max(0, depth - 1);
    if (!inCode && depth === 0 && (cell.startsWith(' + ', i) || cell.startsWith(' · ', i))) {
      segments.push(current);
      current = '';
      i += 2;
      continue;
    }
    current += ch;
  }
  segments.push(current);

  return segments;
}

function cleanKey(segment) {
  return segment
    .replace(/\*\*/g, '')
    .replace(/_\(new\)_/g, '')
    .replace(/`/g, '')
    .trim();
}

/**
 * Parses one doc into subject occurrences, referrals, ClickUp mentions and
 * unrecognized-family warnings. Companion docs only yield referrals and
 * mentions.
 * @param {string} text Markdown source.
 * @param {object} [opts] {grammar, home, doc, companion, excludedFamilies}.
 * @returns {{occurrences: object[], referrals: object[], mentions: object[], warnings: object[]}} Parse result.
 */
function parseTasksText(text, opts = {}) {
  const grammar = opts.grammar ?? defaultGrammar();
  const home = opts.home ?? DEFAULT_HOME;
  const doc = opts.doc ?? 'TASKS.md';
  const companion = Boolean(opts.companion);
  const knownFamilies = new Set([...grammar.families, ...(opts.excludedFamilies ?? [])]);
  const pairRe = new RegExp(`${grammar.idSource}\\s+${CU_ID_RE.source}`, 'g');
  const out = { occurrences: [], referrals: [], mentions: [], warnings: [] };
  const headings = [];
  let table = null;
  let inFence = false;

  const inherited = () => headings.findLast(heading => heading.bucket)?.bucket ?? null;
  const skipped = () => Boolean(headings.at(-1)?.skip);
  const mention = (cuIds, line) => cuIds.forEach(cu => out.mentions.push({ home, doc, line, cu }));
  const add = (line, shape, taskIds, cuIds, inline, label) => {
    const section = inherited();
    out.occurrences.push({
      home,
      doc,
      line,
      shape,
      taskIds: unique(taskIds),
      cuIds: unique(cuIds),
      bucket: inline ?? section ?? 'open',
      source: inline ? 'inline' : section ? 'section' : 'default',
      label,
    });
  };

  text.split(/\r?\n/).forEach((raw, index) => {
    const line = index + 1;
    if (/^\s*(```|~~~)/.test(raw)) {
      inFence = !inFence;
      table = null;

      return;
    }
    if (inFence) return;
    const trimmed = raw.trim();
    const isTableLine = trimmed.startsWith('|');
    if (!isTableLine) table = null;
    const cuIds = extractCuIds(raw);

    const heading = trimmed.match(/^(#{1,6})\s+(.*?)\s*#*$/);
    if (heading) {
      const level = heading[1].length;
      while (headings.length && headings.at(-1).level >= level) headings.pop();
      const parentSkip = skipped();
      const clean = stripEmoji(heading[2])
        .replace(/[*_`]/g, '')
        .replace(/^[\s§\d.]+/, '')
        .trim();
      headings.push({
        level,
        bucket: earliestStatus(heading[2]),
        skip: parentSkip || SKIP_SECTION_RE.test(clean),
      });
      const taskIds =
        !companion && !skipped() && level >= 2 && level <= 4
          ? leadingRun(heading[2].replace(/[*`]/g, ''), grammar)
          : [];
      if (taskIds.length)
        add(line, 'heading', taskIds, cuIds, headings.at(-1).bucket, clean.slice(0, 60));
      else mention(cuIds, line);

      return;
    }

    if (isTableLine && !table) {
      const header = splitRow(trimmed).map(normalizeHeader);
      table = { header, cols: tableColumns(header) };

      return;
    }

    const referrals = [...raw.matchAll(REFERRAL_RE)];
    if (referrals.length) {
      for (const m of referrals) {
        out.referrals.push({
          home,
          doc,
          line,
          idText: m[1].trim(),
          taskIds: extractPrdIds(m[1], grammar),
          cu: m[2],
          target: m[3].trim(),
          targetDoc: m[4].trim(),
        });
      }

      return;
    }

    if (companion || skipped() || /^\s*>/.test(raw)) {
      mention(cuIds, line);

      return;
    }

    if (isTableLine) {
      const cells = splitRow(trimmed);
      if (cells.every(cell => /^:?-+:?$/.test(cell))) return;
      const { cols } = table;
      if (cols.key < 0) {
        mention(cuIds, line);

        return;
      }
      const keyCell = cells[cols.key] ?? '';
      const segments = splitSegments(keyCell).map(cleanKey);
      const taskIds = segments.flatMap(segment => leadingRun(segment, grammar));
      for (const segment of segments) {
        const family = segment.match(GENERIC_ID_RE)?.[1];
        if (family && !knownFamilies.has(family)) {
          out.warnings.push({ home, doc, line, family, text: segment.slice(0, 40) });
        }
      }
      const rowCu = cols.cu >= 0 ? extractCuIds(cells[cols.cu]) : cuIds;
      const firstFamily = segments[0].match(GENERIC_ID_RE)?.[1];
      const isForeign = Boolean(firstFamily) && !grammar.families.has(firstFamily);
      if (!taskIds.length && !(cols.cu >= 0 && rowCu.length && !isForeign)) {
        mention(cuIds, line);

        return;
      }
      mention(
        cuIds.filter(cu => !rowCu.includes(cu)),
        line
      );
      const inline =
        statusFromCell(cells[cols.status]) ??
        earliestStatus(cells[cols.label]) ??
        earliestStatus(keyCell.split(/ — |→/)[0]) ??
        earliestStatus(cells[cols.task]?.split(/ — |→/)[0]);
      const label =
        (cells[cols.label] ?? '').replace(/\*/g, '').trim() ||
        segments
          .join(' + ')
          .split(/ — | \(/)[0]
          .slice(0, 60);
      add(line, 'table', taskIds, rowCu, inline, label);

      return;
    }

    const bullet = raw.match(/^\s*[-*]\s+\*\*([^*]+)\*\*(.*)$/);
    const bulletIds = bullet ? leadingRun(bullet[1].replace(/`/g, ''), grammar) : [];
    if (bulletIds.length) {
      const after = bullet[2].match(/^\s*(?:_\(new\)_\s*)?(✅|❌|🔄|📋|🧪|⛔|⏸|❓)/u);
      const bracket = bullet[2].match(/\[([^\]]*)\]\s*$/);
      const inline =
        (after && STATUS_BUCKETS[after[1]]) ?? earliestStatus(bracket?.[1]) ?? earliestStatus(raw);
      add(line, 'bullet', bulletIds, cuIds, inline, bullet[1].trim().slice(0, 60));

      return;
    }

    // "BOT-01 `86c…`, BOT-02 `86c…`": two or more ID + ticket pairs.
    const pairs = [...raw.matchAll(pairRe)];
    if (pairs.length >= 2) {
      for (const m of pairs)
        add(line, 'pair', [`${m[1]}-${m[2]}${m[3]}${m[4]}`], [m[5]], null, m[0]);

      return;
    }

    // Under a status heading, a line that is only IDs lists finished (or
    // open) tasks: "BOT-01, BOT-02 (partial) and BOT-03."
    if (inherited()) {
      const body = stripParens(raw.replace(/^\s*(?:[-*]|\d+\.)\s+/, '').replace(/\*\*/g, ''));
      const tokens = scanIds(body, grammar);
      let residue = '';
      let pos = 0;
      for (const token of tokens) {
        residue += body.slice(pos, token.start);
        pos = token.end;
      }
      residue += body.slice(pos);
      if (tokens.length && /^(?:[\s,.;]|\band\b)*$/.test(residue)) {
        for (const id of unique(tokens.flatMap(token => token.ids)))
          add(line, 'list', [id], [], null, id);
        mention(cuIds, line);

        return;
      }
    }

    mention(cuIds, line);
  });

  return out;
}

/**
 * Parses a TASKS doc from disk as the default home.
 * @param {string} filePath Path to the doc.
 * @returns {{occurrences: object[], referrals: object[], mentions: object[], warnings: object[]}} Parse result.
 */
function parseTasksMd(filePath) {
  return parseTasksText(fs.readFileSync(filePath, 'utf8'), { doc: filePath });
}

async function fetchClickUpTasks(listId, token) {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch missing — requires Node 18+. Current: ' + process.version);
  }
  const tasks = [];
  let page = 0;
  while (true) {
    const url = `${CLICKUP_API_BASE}/list/${listId}/task?include_closed=true&subtasks=true&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: token, 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `ClickUp ${res.status} ${res.statusText} on list ${listId}: ${body.slice(0, 200)}`
      );
    }
    const data = await res.json();
    if (!Array.isArray(data.tasks)) throw new Error('ClickUp response missing tasks[]');
    tasks.push(...data.tasks);
    if (data.last_page || data.tasks.length === 0) break;
    page += 1;
    if (page > 100) throw new Error('Pagination runaway > 100 pages — aborting');
  }
  return tasks;
}

/**
 * Maps a ClickUp status to the coarse bucket by its type, so renamed statuses
 * keep working.
 * @param {{type?: string}} status ClickUp status object.
 * @returns {'open'|'closed'} Bucket.
 */
function bucketForClickUpStatus(status) {
  const type = status?.type;
  if (type === 'closed' || type === 'done') return 'closed';
  return 'open';
}

function compareRank(a, b) {
  return (
    SOURCE_RANK[a.source] - SOURCE_RANK[b.source] ||
    SHAPE_RANK[a.shape] - SHAPE_RANK[b.shape] ||
    a.line - b.line
  );
}

function idsOf(subject) {
  return subject.taskIds.join(', ') || subject.label;
}

/**
 * Merges one home's occurrences into subjects: occurrences that share a task
 * ID or a ClickUp ID describe one subject. The best-ranked occurrence (stated
 * status before inherited before default, then table before heading before
 * bullet) gives the subject its line, label and bucket.
 * @param {object[]} occurrences Occurrences from parseTasksText.
 * @returns {{subjects: object[], conflicts: object[]}} Subjects by line and conflicting duplicates.
 */
function mergeSubjects(occurrences) {
  const parent = occurrences.map((_, i) => i);
  const find = i => {
    let root = i;
    while (parent[root] !== root) root = parent[root];

    return root;
  };
  const owner = new Map();
  occurrences.forEach((occ, i) => {
    for (const key of [...occ.taskIds.map(id => `t:${id}`), ...occ.cuIds.map(cu => `c:${cu}`)]) {
      if (owner.has(key)) parent[find(i)] = find(owner.get(key));
      else owner.set(key, i);
    }
  });
  const groups = new Map();
  occurrences.forEach((occ, i) => {
    const root = find(i);
    groups.set(root, [...(groups.get(root) ?? []), occ]);
  });

  const subjects = [];
  const conflicts = [];
  for (const group of groups.values()) {
    const ranked = [...group].sort(compareRank);
    const top = ranked[0];
    const byLine = [...group].sort((a, b) => a.line - b.line);
    const subject = {
      home: top.home,
      doc: top.doc,
      line: top.line,
      kind: top.shape,
      label: top.label,
      bucket: top.bucket,
      source: top.source,
      taskIds: unique(ranked.flatMap(occ => occ.taskIds)),
      cuIds: unique(ranked.flatMap(occ => occ.cuIds)),
      primaryCu: ranked.find(occ => occ.cuIds.length)?.cuIds[0] ?? null,
      occurrences: byLine,
    };
    subjects.push(subject);
    const stated = byLine.filter(occ => occ.source !== 'default');
    if (new Set(stated.map(occ => occ.bucket)).size > 1) {
      conflicts.push({
        type: 'conflicting-duplicate',
        homes: [top.home],
        ids: idsOf(subject),
        detail: stated.map(occ => `${occ.bucket} at ${occ.doc}:${occ.line}`).join(', '),
      });
    }
  }
  subjects.sort((a, b) => a.line - b.line);

  return { subjects, conflicts };
}

function publicSubject(subject) {
  return {
    doc: subject.doc,
    line: subject.line,
    kind: subject.kind,
    label: subject.label,
    bucket: subject.bucket,
    source: subject.source,
    taskIds: subject.taskIds,
    cuIds: subject.cuIds,
    primaryCu: subject.primaryCu,
    lines: subject.occurrences.map(occ => occ.line),
  };
}

/**
 * Reads a repo-relative doc from the working tree or from a git ref.
 * @param {string} root Repository root.
 * @param {string|null} ref Git ref, or null for the working tree.
 * @param {string} rel Repo-relative path.
 * @returns {string|null} Text, or null when the doc does not exist there.
 */
function readDoc(root, ref, rel) {
  if (ref) {
    try {
      return execFileSync('git', ['-C', root, 'show', `${ref}:${rel}`], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        maxBuffer: 64 * 1024 * 1024,
      });
    } catch {
      return null;
    }
  }
  const file = path.join(root, rel);

  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

/**
 * Builds the drift report. Docs of every home are always read, so referrals,
 * duplicates and wrong-list links are checked across homes; only issues that
 * touch a selected home are kept.
 * @param {object} input {config, docs, tickets, selected, grammar}; docs maps
 * home key → {found, missing, occurrences, referrals, mentions, warnings};
 * tickets maps listId → ClickUp tasks, or is null when offline.
 * @returns {{homes: object[], consistency: object[], notices: object[], drift: boolean}} Report body.
 */
function summarize({ config, docs, tickets, selected, grammar }) {
  const homesByKey = new Map(config.homes.map(home => [home.key, home]));
  const consistency = [];
  const notices = [];
  const merged = {};

  for (const home of config.homes) {
    const entry = docs[home.key];
    const { subjects, conflicts } = mergeSubjects(entry.occurrences);
    merged[home.key] = subjects;
    consistency.push(...conflicts);
    for (const doc of entry.missing) {
      notices.push({ type: 'missing-doc', homes: [home.key], ids: doc, detail: 'not found' });
    }
    for (const warning of entry.warnings) {
      consistency.push({
        type: 'unrecognized-family',
        homes: [home.key],
        ids: warning.text,
        detail: `${warning.family} is not in idFamilies (${warning.doc}:${warning.line})`,
      });
    }
  }

  // The same task ID or ticket as a subject in two homes.
  const seen = new Map();
  for (const home of config.homes) {
    for (const subject of merged[home.key]) {
      for (const key of [...subject.taskIds, subject.primaryCu].filter(Boolean)) {
        const where = seen.get(key) ?? new Map();
        if (!where.has(home.key)) where.set(home.key, `${subject.doc}:${subject.line}`);
        seen.set(key, where);
      }
    }
  }
  for (const [key, where] of seen) {
    if (where.size > 1) {
      consistency.push({
        type: 'cross-home-duplicate',
        homes: [...where.keys()],
        ids: key,
        detail: [...where.values()].join(', '),
      });
    }
  }

  const findHome = name =>
    config.homes.find(home =>
      [home.key, home.name].some(value => value.toLowerCase() === name.toLowerCase())
    );
  for (const home of config.homes) {
    for (const referral of docs[home.key].referrals) {
      const target = findHome(referral.target);
      const issue = (type, detail) =>
        consistency.push({
          type,
          homes: unique([home.key, target?.key].filter(Boolean)),
          ids: referral.idText,
          detail: `${detail} (${referral.doc}:${referral.line})`,
        });
      if (!target) {
        issue('referral-unknown-home', `no home named "${referral.target}"`);
        continue;
      }
      if (referral.targetDoc !== target.tasks) {
        issue(
          'referral-wrong-doc',
          `${target.name} lives in ${target.tasks}, not ${referral.targetDoc}`
        );
        continue;
      }
      if (!docs[target.key].found) {
        issue('referral-missing-doc', `${target.tasks} does not exist`);
        continue;
      }
      const hits = merged[target.key].filter(subject =>
        subject.taskIds.some(id => referral.taskIds.includes(id))
      );
      const unmatched = referral.taskIds.filter(
        id => !hits.some(subject => subject.taskIds.includes(id))
      );
      if (unmatched.length) {
        issue('dangling-referral', `no ${unmatched.join(', ')} row in ${target.tasks}`);
        continue;
      }
      if (!hits.some(subject => subject.cuIds.includes(referral.cu))) {
        const actual = hits.map(subject => subject.primaryCu ?? 'no ticket').join(', ');
        issue('referral-cu-mismatch', `referral says ${referral.cu}, row has ${actual}`);
      }
    }
  }

  // Tickets named only in prose: they suppress only-in-ClickUp, so list them.
  const held = new Set(
    config.homes.flatMap(home => merged[home.key].flatMap(subject => subject.cuIds))
  );
  for (const home of config.homes) {
    const byCu = new Map();
    for (const mention of docs[home.key].mentions) {
      if (!held.has(mention.cu))
        byCu.set(mention.cu, [...(byCu.get(mention.cu) ?? []), `${mention.doc}:${mention.line}`]);
    }
    for (const [cu, lines] of byCu) {
      notices.push({
        type: 'cu-only-in-mentions',
        homes: [home.key],
        ids: cu,
        detail: unique(lines).join(', '),
      });
    }
  }

  const ticketHome = new Map();
  for (const home of config.homes) {
    if (!tickets || !home.listId) continue;
    for (const ticket of tickets[home.listId] ?? []) ticketHome.set(ticket.id, home);
  }
  const referenced = new Set([
    ...held,
    ...config.homes.flatMap(home => docs[home.key].mentions.map(mention => mention.cu)),
    ...config.homes.flatMap(home => docs[home.key].referrals.map(referral => referral.cu)),
  ]);

  const homes = selected.map(key => {
    const home = homesByKey.get(key);
    const subjects = merged[key];
    const report = {
      key,
      name: home.name,
      doc: home.tasks,
      listId: home.listId,
      docFound: docs[key].found,
      subjects: subjects.map(publicSubject),
      ticketsInList: null,
      coverage: null,
      onlyInTasks: [],
      onlyInClickUp: [],
      statusMismatches: [],
      linkProblems: [],
    };
    if (!home.listId) {
      notices.push({
        type: 'no-list',
        homes: [key],
        ids: home.name,
        detail: 'listId is null; ClickUp skipped',
      });

      return report;
    }
    if (!tickets) return report;

    const own = tickets[home.listId] ?? [];
    const ownById = new Map(own.map(ticket => [ticket.id, ticket]));
    const nameIds = new Map(
      own.map(ticket => [ticket.id, leadingRun(ticket.name ?? '', grammar, NAME_GAP_RE)])
    );
    const byName = subject =>
      own.filter(ticket => nameIds.get(ticket.id).some(id => subject.taskIds.includes(id)));
    const claimed = new Set(referenced);
    report.ticketsInList = own.length;
    report.coverage = {
      withIds: own.filter(ticket => nameIds.get(ticket.id).length).length,
      total: own.length,
    };

    for (const subject of subjects) {
      const ids = idsOf(subject);
      const named = byName(subject);
      named.forEach(ticket => claimed.add(ticket.id));
      let ticket = named[0] ?? null;
      if (subject.primaryCu) {
        ticket = ownById.get(subject.primaryCu) ?? null;
        if (!ticket) {
          const other = ticketHome.get(subject.primaryCu);
          report.linkProblems.push({
            ids,
            cu: subject.primaryCu,
            reason: other ? `ticket is in the ${other.name} list` : `not in ${home.name} list`,
            hint: other ? '' : named.map(match => `name match ${match.id}`).join(', '),
            doc: subject.doc,
            line: subject.line,
          });
          continue;
        }
      } else if (!ticket) {
        report.onlyInTasks.push({
          ids,
          bucket: subject.bucket,
          doc: subject.doc,
          line: subject.line,
        });
        continue;
      }
      const cuBucket = bucketForClickUpStatus(ticket.status);
      if (cuBucket !== subject.bucket) {
        report.statusMismatches.push({
          ids,
          tasks: subject.bucket,
          clickup: cuBucket,
          status: ticket.status?.status ?? '?',
          cu: ticket.id,
          name: ticket.name,
          doc: subject.doc,
          line: subject.line,
        });
      }
    }
    for (const ticket of own) {
      if (claimed.has(ticket.id)) continue;
      report.onlyInClickUp.push({
        id: ticket.id,
        name: ticket.name,
        status: ticket.status?.status ?? '?',
        bucket: bucketForClickUpStatus(ticket.status),
      });
    }

    return report;
  });

  const isSelected = item => item.homes.some(key => selected.includes(key));
  const kept = consistency.filter(isSelected);
  const drift =
    kept.length > 0 ||
    homes.some(
      home =>
        home.onlyInTasks.length ||
        home.onlyInClickUp.length ||
        home.statusMismatches.length ||
        home.linkProblems.length
    );

  return { homes, consistency: kept, notices: notices.filter(isSelected), drift };
}

/**
 * Renders the report as text.
 * @param {object} report Report from main (config, source, clickup + summarize).
 * @returns {string} Text report.
 */
function formatReport(report) {
  const BANNER = '═'.repeat(63);
  const out = [
    BANNER,
    '  sync-eco-store-tasks · META-07 (read-only diff across task homes)',
    BANNER,
    `  Config:  ${report.config}`,
    `  Source:  ${report.source}`,
    `  ClickUp: ${report.clickup}`,
    `  Homes:   ${report.homes.map(home => home.key).join(', ')}`,
  ];
  const section = (title, rows) => {
    out.push('', `  ── ${title} (${rows.length}) ──`);
    out.push(...(rows.length ? rows : ['  ∅ none']));
  };
  const at = row => `(${row.doc}:${row.line})`;

  for (const home of report.homes) {
    const open = home.subjects.filter(subject => subject.bucket === 'open').length;
    out.push(
      '',
      `▸ ${home.name} · ${home.doc} · ${home.listId ? `list ${home.listId}` : 'no list'}`
    );
    out.push(
      home.docFound
        ? `  Subjects:         ${home.subjects.length} (${open} open · ${home.subjects.length - open} closed)`
        : '  Subjects:         (doc not found)'
    );
    if (!home.coverage) {
      out.push(`  ClickUp:          skipped (${home.listId ? 'offline' : 'no list'})`);
      continue;
    }
    const { withIds, total } = home.coverage;
    const pct = total ? Math.round((withIds / total) * 100) : 0;
    const ok = !total || withIds / total >= BRIDGE_THRESHOLD;
    out.push(`  CU tasks in list: ${home.ticketsInList}`);
    out.push(
      `  Bridge coverage:  ${withIds}/${total} CU tasks carry a PRD ID in name (${pct}%) ${ok ? '✓' : '⚠ low — name tickets "<ID> <title>"'}`
    );
    section(
      'only-in-TASKS',
      home.onlyInTasks.map(row => `  • ${row.ids}  [${row.bucket}]  no ticket  ${at(row)}`)
    );
    section(
      'only-in-ClickUp',
      home.onlyInClickUp.map(row => `  • ${row.id}  [${row.status}]  ${row.name}`)
    );
    section(
      'status mismatches',
      home.statusMismatches.map(
        row =>
          `  • ${row.ids}  TASKS=${row.tasks}  CU=${row.clickup} (${row.status})  ${row.cu}  ${row.name}  ${at(row)}`
      )
    );
    section(
      'link problems',
      home.linkProblems.map(
        row =>
          `  • ${row.ids}  CU ${row.cu}  ${row.reason}${row.hint ? ` — ${row.hint}` : ''}  ${at(row)}`
      )
    );
  }
  out.push('');
  section(
    'doc consistency',
    report.consistency.map(issue => `  • [${issue.type}] ${issue.ids}  ${issue.detail}`)
  );
  section(
    'notices',
    report.notices.map(notice => `  • [${notice.type}] ${notice.ids}  ${notice.detail}`)
  );
  out.push('', BANNER, report.drift ? '  ✗ Drift found (exit 1)' : '  ✓ No drift (exit 0)', BANNER);

  return out.join('\n');
}

/**
 * CLI entry point.
 * @returns {Promise<number>} Exit code.
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();

    return 0;
  }
  const log = args.verbose ? message => console.error(`· ${message}`) : () => {};
  const root = path.resolve(args.root);
  const configPath = path.resolve(args.config);
  let config;
  try {
    config = loadConfig(configPath);
  } catch (err) {
    throw new UsageError(`config ${configPath}: ${err.message}`);
  }
  const grammar = buildGrammar(config.idFamilies);
  const keys = config.homes.map(home => home.key);
  const selected = args.all ? keys : [args.home ?? DEFAULT_HOME];
  if (!keys.includes(selected[0])) {
    throw new UsageError(`unknown home "${selected[0]}" (known: ${keys.join(', ')})`);
  }
  if (args.ref) {
    try {
      execFileSync(
        'git',
        ['-C', root, 'rev-parse', '--verify', '--quiet', `${args.ref}^{commit}`],
        {
          stdio: 'ignore',
        }
      );
    } catch {
      throw new UsageError(`unknown git ref: ${args.ref}`);
    }
  }

  const target = config.homes.find(home => home.key === selected[0]);
  if (args.listId) target.listId = args.listId;
  const tasksOverride = args.tasksPath ? path.resolve(args.tasksPath) : null;
  if (tasksOverride && !fs.existsSync(tasksOverride)) {
    throw new UsageError(`--tasks-path not found: ${args.tasksPath}`);
  }
  if (tasksOverride && !fs.statSync(tasksOverride).isFile()) {
    throw new UsageError(`--tasks-path is not a file: ${args.tasksPath}`);
  }

  const token = process.env.CLICKUP_API_TOKEN;
  if (!token && !args.offline && !args.fixture) {
    console.error('✗ CLICKUP_API_TOKEN env var is required.');
    console.error(
      '  Get one at https://app.clickup.com/settings/apps (Personal Token, starts with pk_)'
    );
    console.error('  Or pass --offline for doc consistency only.');

    return 2;
  }

  const docs = {};
  for (const home of config.homes) {
    const entry = {
      found: false,
      missing: [],
      occurrences: [],
      referrals: [],
      mentions: [],
      warnings: [],
    };
    const sources = [[home.tasks, false], ...home.companions.map(rel => [rel, true])];
    for (const [rel, companion] of sources) {
      const text =
        home === target && !companion && tasksOverride
          ? fs.readFileSync(tasksOverride, 'utf8')
          : readDoc(root, args.ref, rel);
      if (text === null) {
        entry.missing.push(rel);
        continue;
      }
      if (!companion) entry.found = true;
      const parsed = parseTasksText(text, {
        grammar,
        home: home.key,
        doc: rel,
        companion,
        excludedFamilies: config.excludedFamilies,
      });
      for (const key of ['occurrences', 'referrals', 'mentions', 'warnings'])
        entry[key].push(...parsed[key]);
      log(`${rel}: ${parsed.occurrences.length} occurrences, ${parsed.referrals.length} referrals`);
    }
    docs[home.key] = entry;
  }

  let tickets = null;
  let clickup = 'offline';
  if (args.fixture) {
    let fixture;
    try {
      fixture = JSON.parse(fs.readFileSync(path.resolve(args.fixture), 'utf8'));
    } catch (err) {
      throw new UsageError(`fixture ${args.fixture}: ${err.message}`);
    }
    tickets = Object.fromEntries(
      config.homes
        .filter(home => home.listId)
        .map(home => [home.listId, fixture[home.listId] ?? []])
    );
    clickup = `fixture ${args.fixture}`;
  } else if (!args.offline) {
    tickets = {};
    try {
      for (const listId of unique(config.homes.map(home => home.listId).filter(Boolean))) {
        log(`fetching list ${listId}…`);
        tickets[listId] = await fetchClickUpTasks(listId, token);
      }
    } catch (err) {
      console.error(`✗ ClickUp fetch failed: ${err.message}`);

      return 3;
    }
    clickup = 'live API';
  }

  const report = {
    config: configPath.startsWith(root + path.sep) ? path.relative(root, configPath) : configPath,
    source:
      (args.ref ? `git ref ${args.ref}` : 'working tree') +
      (tasksOverride ? ` (${target.key} TASKS from ${args.tasksPath})` : ''),
    clickup,
    ...summarize({ config, docs, tickets, selected, grammar }),
  };
  console.log(args.json ? JSON.stringify(report, null, 2) : formatReport(report));

  return report.drift ? 1 : 0;
}

if (require.main === module) {
  main()
    .then(code => {
      process.exitCode = code;
    })
    .catch(err => {
      if (err instanceof UsageError) {
        console.error(`✗ ${err.message}`);
        console.error('  Run with --help for usage.');
        process.exitCode = 2;

        return;
      }
      console.error('✗ unexpected error:', err);
      process.exit(99);
    });
}

module.exports = {
  parseTasksMd,
  parseTasksText,
  extractPrdIds,
  extractCuId,
  scanIds,
  loadConfig,
  bucketForClickUpStatus,
  summarize,
};
