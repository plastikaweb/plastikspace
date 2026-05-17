#!/usr/bin/env node
/**
 * META-05 — ClickUp ↔ TASKS.md automation (Phase 1 of 4).
 *
 * Read-only diff between the eco-store TASKS.md and a ClickUp list. Reports
 * three sections plus a bridge-validation summary. No writes.
 *
 * Usage:
 *   CLICKUP_API_TOKEN=pk_... node tools/scripts/sync-eco-store-tasks.cjs
 *   node tools/scripts/sync-eco-store-tasks.cjs --tasks-path /custom/TASKS.md --list-id 901521018763
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_TASKS_PATH = path.resolve(__dirname, '..', '..', 'apps', 'eco-store', 'TASKS.md');
const DEFAULT_LIST_ID = '901521018763';
const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2';

// PRD ID grammar: MODULE prefix in caps, optional "-research" sub-family,
// trailing dash + digits, optional sub-letter (PRV-02b) or further suffix.
// Examples: META-05, PRV-02b, BUG-001, MKT-research-01, A11Y-002.
const PRD_ID_RE = /\b([A-Z][A-Z0-9]+(?:-research)?-\d+[a-z]?)\b/g;

// Status symbols → coarse bucket. Per design choice: Done ↔ closed, all
// non-done states ↔ open. Section headings (### Done ✅) cascade to rows
// that don't carry their own emoji.
const STATUS_BUCKETS = {
  '✅': 'closed',
  '🔄': 'open',
  '📋': 'open',
  '🧪': 'open',
  '⛔': 'open',
  '⏸️': 'open',
  '⏸': 'open',
  '❓': 'open',
};

function parseArgs(argv) {
  const args = { tasksPath: DEFAULT_TASKS_PATH, listId: DEFAULT_LIST_ID, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--tasks-path') args.tasksPath = argv[++i];
    else if (a === '--list-id') args.listId = argv[++i];
    else if (a === '--verbose' || a === '-v') args.verbose = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function printHelp() {
  console.log(`sync-eco-store-tasks — META-05 Phase 1 (read-only)

Diffs eco-store TASKS.md against a ClickUp list. Three-section report:
  • only-in-TASKS    (PRD IDs in TASKS.md whose CU link doesn't resolve)
  • only-in-ClickUp  (CU tasks whose name carries a PRD ID not in TASKS.md)
  • status mismatches (Done ↔ closed buckets disagree)

Options:
  --tasks-path <path>   Override TASKS.md location (default: ${DEFAULT_TASKS_PATH})
  --list-id <id>        Override ClickUp list ID (default: ${DEFAULT_LIST_ID})
  --verbose             Print per-row parse details
  --help                Show this help

Env:
  CLICKUP_API_TOKEN     Required. Personal token (pk_...).
`);
}

function findFirstBucket(line) {
  for (const symbol of Object.keys(STATUS_BUCKETS)) {
    if (line.includes(symbol)) return STATUS_BUCKETS[symbol];
  }
  return null;
}

function extractPrdIds(text) {
  const found = new Set();
  let m;
  PRD_ID_RE.lastIndex = 0;
  while ((m = PRD_ID_RE.exec(text)) !== null) found.add(m[1]);
  return [...found];
}

function extractBoldPrdIds(text) {
  const ids = new Set();
  const re = /\*\*([A-Z][A-Z0-9]+(?:-research)?-\d+[a-z]?)\*\*/g;
  let m;
  while ((m = re.exec(text)) !== null) ids.add(m[1]);
  return ids;
}

function extractCuId(line) {
  const m = line.match(/`(86[a-z0-9]{7,})`/i);
  return m ? m[1] : null;
}

/**
 * Walk TASKS.md line-by-line. Track the most recent section heading status
 * (### Done ✅, ### In progress 🔄, …) so rows without an inline emoji
 * inherit it. Each line is checked for PRD IDs and a CU ID.
 *
 * Multiple lines may mention the same PRD ID. We score each occurrence so
 * the "subject" line (bold PRD ID in a table row with an inline status) wins
 * over prose mentions inside Done/Pending sections. Without this scoring,
 * a row like "BOT-05 (pending BUG-001 verify)" inside a "### Done ✅" block
 * would falsely mark BUG-001 as closed.
 */
const PRIORITY = {
  BOLD_TABLE_INLINE: 5, // **ID** appears in a table row that carries its own status emoji
  BOLD_TABLE_SECTION: 4, // **ID** in a table row, status inherited from section heading
  BOLD_PROSE: 3, // **ID** in a non-table line (e.g. spec heading)
  PLAIN_TABLE: 2, // bare ID in a table row
  PLAIN_PROSE: 1, // bare ID in prose (likely a referent, not a subject)
};

function isTableRow(line) {
  return line.startsWith('|') && line.split('|').length >= 3;
}

function parseTasksMd(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');
  const rows = new Map();
  let sectionBucket = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('#')) {
      sectionBucket = findFirstBucket(line) ?? sectionBucket;
      continue;
    }

    const allIds = extractPrdIds(line);
    if (!allIds.length) continue;

    const boldIds = extractBoldPrdIds(line);
    const inline = findFirstBucket(line);
    const bucket = inline ?? sectionBucket ?? 'open';
    const cuId = extractCuId(line);
    const tableRow = isTableRow(line);

    for (const id of allIds) {
      const isBold = boldIds.has(id);
      const priority = isBold
        ? tableRow
          ? inline
            ? PRIORITY.BOLD_TABLE_INLINE
            : PRIORITY.BOLD_TABLE_SECTION
          : PRIORITY.BOLD_PROSE
        : tableRow
          ? PRIORITY.PLAIN_TABLE
          : PRIORITY.PLAIN_PROSE;

      const prev = rows.get(id);
      if (!prev) {
        rows.set(id, { prdId: id, bucket, cuId, line: i + 1, priority });
      } else {
        // Bucket/line come from the highest-priority occurrence (subject of the row).
        if (priority > prev.priority) {
          prev.bucket = bucket;
          prev.line = i + 1;
          prev.priority = priority;
        }
        // CU ID can come from any occurrence (often a prose footnote in the
        // task's spec section, not the top-of-file focus list).
        if (!prev.cuId && cuId) prev.cuId = cuId;
      }
    }
  }
  return rows;
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

function bucketForClickUpStatus(status) {
  const type = status?.type;
  if (type === 'closed' || type === 'done') return 'closed';
  return 'open';
}

function summarize(tasks, clickUpTasks) {
  const tasksMd = tasks;
  const cuByCuId = new Map();
  const cuByPrdId = new Map();
  let cuWithPrd = 0;

  for (const t of clickUpTasks) {
    cuByCuId.set(t.id, t);
    const ids = extractPrdIds(t.name || '');
    if (ids.length) cuWithPrd++;
    for (const prdId of ids) {
      if (!cuByPrdId.has(prdId)) cuByPrdId.set(prdId, []);
      cuByPrdId.get(prdId).push(t);
    }
  }

  const onlyInTasks = [];
  const statusMismatches = [];

  for (const row of tasksMd.values()) {
    const linkedCu = row.cuId ? cuByCuId.get(row.cuId) : null;
    const byName = cuByPrdId.get(row.prdId) ?? [];

    if (!linkedCu && byName.length === 0) {
      onlyInTasks.push({
        ...row,
        reason: row.cuId ? `CU ${row.cuId} not in list` : 'no CU link, no name match',
      });
      continue;
    }

    const cu = linkedCu ?? byName[0];
    const cuBucket = bucketForClickUpStatus(cu.status);
    if (cuBucket !== row.bucket) {
      statusMismatches.push({
        prdId: row.prdId,
        tasksBucket: row.bucket,
        cuBucket,
        cuStatus: cu.status?.status ?? '?',
        cuId: cu.id,
        cuName: cu.name,
      });
    }
  }

  const tasksMdPrdIds = new Set(tasksMd.keys());
  const onlyInClickUp = [];
  for (const [prdId, cuList] of cuByPrdId.entries()) {
    if (!tasksMdPrdIds.has(prdId)) {
      for (const cu of cuList) {
        onlyInClickUp.push({
          prdId,
          cuId: cu.id,
          cuName: cu.name,
          cuStatus: cu.status?.status ?? '?',
        });
      }
    }
  }

  return {
    onlyInTasks,
    onlyInClickUp,
    statusMismatches,
    bridgeStats: {
      tasksMdRows: tasksMd.size,
      clickUpTasks: clickUpTasks.length,
      clickUpWithPrdPrefix: cuWithPrd,
      bridgeCoverage: clickUpTasks.length === 0 ? 0 : cuWithPrd / clickUpTasks.length,
    },
  };
}

function formatReport(report, ctx) {
  const out = [];
  const { onlyInTasks, onlyInClickUp, statusMismatches, bridgeStats } = report;

  out.push('═══════════════════════════════════════════════════════════════');
  out.push('  sync-eco-store-tasks · META-05 Phase 1 (read-only diff)');
  out.push('═══════════════════════════════════════════════════════════════');
  out.push(`  TASKS.md:        ${ctx.tasksPath}`);
  out.push(`  ClickUp list:    ${ctx.listId}`);
  out.push(`  Rows in TASKS:   ${bridgeStats.tasksMdRows}`);
  out.push(`  CU tasks in list:${bridgeStats.clickUpTasks}`);
  const coveragePct = (bridgeStats.bridgeCoverage * 100).toFixed(1);
  const bridgeOk = bridgeStats.bridgeCoverage >= 0.5;
  out.push(
    `  Bridge coverage: ${bridgeStats.clickUpWithPrdPrefix}/${bridgeStats.clickUpTasks} CU tasks carry a PRD-ID in name (${coveragePct}%) ${bridgeOk ? '✓' : '⚠ low — Phase 2 cannot rely on name-based matching alone'}`
  );
  out.push('');

  out.push(`── only-in-TASKS (${onlyInTasks.length}) ──`);
  if (!onlyInTasks.length) out.push('  ∅ none');
  for (const r of onlyInTasks) {
    out.push(`  • ${r.prdId}  [${r.bucket}]  ${r.reason}  (TASKS.md:${r.line})`);
  }
  out.push('');

  out.push(`── only-in-ClickUp (${onlyInClickUp.length}) ──`);
  if (!onlyInClickUp.length) out.push('  ∅ none');
  for (const r of onlyInClickUp) {
    out.push(`  • ${r.prdId}  CU ${r.cuId}  [${r.cuStatus}]  ${r.cuName}`);
  }
  out.push('');

  out.push(`── status mismatches (${statusMismatches.length}) ──`);
  if (!statusMismatches.length) out.push('  ∅ none');
  for (const r of statusMismatches) {
    out.push(
      `  • ${r.prdId}  TASKS=${r.tasksBucket}  CU=${r.cuBucket} (${r.cuStatus})  ${r.cuName}`
    );
  }
  out.push('');
  out.push('═══════════════════════════════════════════════════════════════');

  return out.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    console.error('✗ CLICKUP_API_TOKEN env var is required.');
    console.error(
      '  Get one at https://app.clickup.com/settings/apps (Personal Token, starts with pk_)'
    );
    process.exit(2);
  }

  if (!fs.existsSync(args.tasksPath)) {
    console.error(`✗ TASKS.md not found at ${args.tasksPath}`);
    process.exit(2);
  }

  if (args.verbose) console.error(`→ parsing ${args.tasksPath}`);
  const tasksMd = parseTasksMd(args.tasksPath);
  if (args.verbose) console.error(`  parsed ${tasksMd.size} PRD IDs`);

  if (args.verbose) console.error(`→ fetching ClickUp list ${args.listId}`);
  let clickUpTasks;
  try {
    clickUpTasks = await fetchClickUpTasks(args.listId, token);
  } catch (err) {
    console.error(`✗ ClickUp fetch failed: ${err.message}`);
    process.exit(3);
  }
  if (args.verbose) console.error(`  fetched ${clickUpTasks.length} CU tasks`);

  const report = summarize(tasksMd, clickUpTasks);
  console.log(formatReport(report, { tasksPath: args.tasksPath, listId: args.listId }));

  const drift =
    report.onlyInTasks.length + report.onlyInClickUp.length + report.statusMismatches.length;
  process.exit(drift === 0 ? 0 : 1);
}

if (require.main === module) {
  main().catch(err => {
    console.error('✗ unexpected error:', err);
    process.exit(99);
  });
}

module.exports = {
  parseTasksMd,
  extractPrdIds,
  extractCuId,
  bucketForClickUpStatus,
  summarize,
};
