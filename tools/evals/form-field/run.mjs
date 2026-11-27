#!/usr/bin/env node
/**
 * META-22: the form-field eval. Asks headless Claude Code for a new filter field on the
 * eco-store orders list and grades what it leaves with grade.mjs (a script, no model).
 *
 * Each run gets its own git worktree, checked out detached at --ref with its own
 * `yarn install`, in a folder outside the repository (default: plastikspace-form-eval next
 * to the main checkout), so that only that commit's CLAUDE.md files and .claude/settings.json
 * load. The worktrees are kept for the next batch and reset before each run; remove them
 * with --clean. The runs load no MCP server (no ClickUp, no PocketBase), no user settings
 * (--setting-sources project,local) and no saved session; Bash is limited to the read-only
 * git commands and the yarn checks below, and git commit and push are refused.
 *
 * Usage (outside the sandbox: worktrees, yarn install and the API):
 *   caffeinate -i node tools/evals/form-field/run.mjs --label before --ref origin/develop
 *   options: --runs 5  --model sonnet  --budget 3 (USD per run)  --tests  --dir <folder>
 *            --timeout 1500 (seconds per run)  --prepare-only (worktrees, no run)
 *            --clean (remove the worktrees and stop)
 * Results: tmp/form-eval/<label>-<n>.json (cost, turns, grade) and <label>-<n>.diff.
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const GRADER = path.join(import.meta.dirname, 'grade.mjs');
const OUT = path.join(ROOT, 'tmp', 'form-eval');

const PROMPT = [
  'En eco-store, la página de pedidos (/comandes) ya se puede filtrar por producto y por estado.',
  'Añade un filtro por método de entrega (envío a domicilio o recogida en la tienda) junto a los otros.',
  'No hagas commit ni push, no arranques PocketBase ni el servidor de desarrollo, y no preguntes: decide tú.',
  'Cuando acabes, resume en pocas líneas qué has cambiado.',
].join(' ');

const ALLOWED_TOOLS = [
  'Read',
  'Edit',
  'Write',
  'Glob',
  'Grep',
  'TodoWrite',
  'Bash(yarn nx test:*)',
  'Bash(yarn nx lint:*)',
  'Bash(yarn nx run-many:*)',
  'Bash(yarn nx affected:*)',
  'Bash(yarn nx show:*)',
  'Bash(yarn i18n:validate)',
  'Bash(yarn eco-conventions:check:*)',
  'Bash(yarn feature-map:find:*)',
  'Bash(yarn task:*)',
  'Bash(git diff:*)',
  'Bash(git status:*)',
  'Bash(git log:*)',
  'Bash(git show:*)',
  'Bash(ls:*)',
];
const DISALLOWED_TOOLS = ['Bash(git commit:*)', 'Bash(git push:*)', 'WebFetch', 'WebSearch'];

/**
 * Reads a --name value from the command line.
 * @param {string} name The option name.
 * @param {string} fallback The default.
 * @returns {string} The value.
 */
function option(name, fallback) {
  const at = process.argv.indexOf(`--${name}`);

  return at === -1 ? fallback : process.argv[at + 1];
}

const label = option('label', '');
const ref = option('ref', 'HEAD');
const runs = Number(option('runs', '5'));
const model = option('model', 'sonnet');
const budget = option('budget', '3');
const timeout = Number(option('timeout', '1500'));
// Next to the main checkout, never under it: a worktree inside it would also load its CLAUDE.md files.
const MAIN_CHECKOUT = path.dirname(
  path.resolve(
    ROOT,
    spawnSync('git', ['rev-parse', '--git-common-dir'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).stdout.trim()
  )
);
const dir = path.resolve(
  option('dir', path.join(path.dirname(MAIN_CHECKOUT), 'plastikspace-form-eval'))
);
const withTests = process.argv.includes('--tests');

/**
 * Runs a command and fails loudly.
 * @param {string} cwd Where.
 * @param {string} cmd The command.
 * @param {string[]} args Its arguments.
 * @returns {string} Its output.
 */
function must(cwd, cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    env: cleanEnv(cwd),
    maxBuffer: 1 << 28,
  });

  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} failed in ${cwd}:\n${result.stdout}${result.stderr}`);
  }

  return result.stdout.trim();
}

/**
 * Builds the environment of a command in a worktree: Nx pinned to it, no cloud, no daemon.
 * @param {string} cwd The worktree.
 * @returns {NodeJS.ProcessEnv} The environment.
 */
function cleanEnv(cwd) {
  const env = {
    ...process.env,
    NX_NO_CLOUD: 'true',
    NX_DAEMON: 'false',
    NX_WORKSPACE_ROOT_PATH: cwd,
  };

  delete env.CLAUDECODE;

  return env;
}

if (process.argv.includes('--clean')) {
  for (const entry of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    spawnSync('git', ['worktree', 'remove', '--force', path.join(dir, entry)], {
      cwd: ROOT,
      stdio: 'inherit',
    });
  }
  fs.rmSync(dir, { recursive: true, force: true });
  spawnSync('git', ['worktree', 'prune'], { cwd: ROOT, stdio: 'inherit' });
  console.log(`Removed ${dir}`);
  process.exit(0);
}

if (!label) {
  console.error(
    'Usage: node tools/evals/form-field/run.mjs --label <name> [--ref <commit>] [--runs 5] ...'
  );
  process.exit(2);
}

const sha = must(ROOT, 'git', ['rev-parse', `${ref}^{commit}`]);

fs.mkdirSync(dir, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

/**
 * Prepares worktree n at the commit: created and installed once, reset afterwards.
 * @param {number} n The run number.
 * @returns {string} The worktree folder.
 */
function prepare(n) {
  const worktree = path.join(dir, `wt-${n}`);

  if (fs.existsSync(path.join(worktree, '.git'))) {
    must(worktree, 'git', ['checkout', '-q', '--force', '--detach', sha]);
    must(worktree, 'git', ['reset', '-q', '--hard', sha]);
    must(worktree, 'git', ['clean', '-q', '-fd']);
  } else {
    must(ROOT, 'git', ['worktree', 'add', '-q', '--detach', worktree, sha]);
  }
  const lock = path.join(worktree, 'node_modules', '.yarn-state.yml');
  const installedFor = path.join(worktree, 'node_modules', '.form-eval-lock');
  const lockHash = must(worktree, 'git', ['hash-object', 'yarn.lock']);

  if (
    !fs.existsSync(lock) ||
    !fs.existsSync(installedFor) ||
    fs.readFileSync(installedFor, 'utf8') !== lockHash
  ) {
    must(worktree, 'yarn', ['install', '--immutable']);
    fs.writeFileSync(installedFor, lockHash);
  }

  return worktree;
}

/**
 * Runs one headless session in a worktree.
 * @param {string} worktree The worktree.
 * @returns {Promise<{ status: number | null, stdout: string, stderr: string, seconds: number }>} The session.
 */
function session(worktree) {
  const args = [
    '-e',
    `alarm ${timeout}; exec @ARGV`,
    'claude',
    '-p',
    PROMPT,
    '--model',
    model,
    '--output-format',
    'json',
    '--max-budget-usd',
    budget,
    '--permission-mode',
    'acceptEdits',
    '--setting-sources',
    'project,local',
    '--strict-mcp-config',
    '--mcp-config',
    '{"mcpServers":{}}',
    '--no-session-persistence',
    '--allowedTools',
    ...ALLOWED_TOOLS,
    '--disallowedTools',
    ...DISALLOWED_TOOLS,
  ];
  const started = Date.now();

  return new Promise(resolve => {
    const child = spawn('perl', args, {
      cwd: worktree,
      env: cleanEnv(worktree),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', chunk => (stdout += chunk));
    child.stderr.on('data', chunk => (stderr += chunk));
    child.on('close', status =>
      resolve({ status, stdout, stderr, seconds: Math.round((Date.now() - started) / 1000) })
    );
  });
}

/**
 * Runs, grades and records run n.
 * @param {number} n The run number.
 * @param {string} worktree Its worktree.
 * @returns {Promise<object>} The record.
 */
async function runOne(n, worktree) {
  const result = await session(worktree);
  let summary = {};

  try {
    summary = JSON.parse(result.stdout);
  } catch {
    summary = { parseError: true, stdout: result.stdout.slice(-2000) };
  }
  const graded = spawnSync('node', [GRADER, worktree, sha, ...(withTests ? ['--tests'] : [])], {
    cwd: worktree,
    encoding: 'utf8',
    env: cleanEnv(worktree),
    maxBuffer: 1 << 28,
  });
  let grade;

  try {
    grade = JSON.parse(graded.stdout);
  } catch {
    grade = { pass: false, graderError: `${graded.stdout}${graded.stderr}`.slice(0, 2000) };
  }
  const record = {
    label,
    run: n,
    ref,
    sha,
    model,
    exit: result.status,
    seconds: result.seconds,
    costUsd: summary.total_cost_usd ?? null,
    turns: summary.num_turns ?? null,
    isError: summary.is_error ?? null,
    subtype: summary.subtype ?? null,
    answer: typeof summary.result === 'string' ? summary.result : null,
    stderr: result.stderr.slice(-1500),
    grade,
  };

  fs.writeFileSync(path.join(OUT, `${label}-${n}.json`), `${JSON.stringify(record, null, 2)}\n`);
  fs.writeFileSync(
    path.join(OUT, `${label}-${n}.diff`),
    spawnSync('git', ['diff', sha], { cwd: worktree, encoding: 'utf8', maxBuffer: 1 << 28 }).stdout
  );
  console.log(
    `${label}-${n}: ${grade.pass ? 'PASS' : 'FAIL'} ` +
      `config=${grade.inConfig} control=${grade.noHandControl} i18n=${grade.translated}/${grade.i18nValid} ` +
      `wired=${grade.wired} tests=${grade.tests} $${record.costUsd ?? '?'} ${record.turns ?? '?'} turns ${record.seconds}s`
  );

  return record;
}

const worktrees = [];

for (let n = 1; n <= runs; n++) {
  console.log(`Preparing wt-${n} at ${sha.slice(0, 8)}…`);
  worktrees.push(prepare(n));
}
if (process.argv.includes('--prepare-only')) {
  console.log(`Prepared ${worktrees.length} worktree(s) in ${dir}`);
  process.exit(0);
}
const records = await Promise.all(worktrees.map((worktree, i) => runOne(i + 1, worktree)));
const count = key => records.filter(record => record.grade[key] === true).length;
const cost = records.reduce((sum, record) => sum + (record.costUsd ?? 0), 0);

console.log(
  `\n${label} (${sha.slice(0, 8)}, ${model}): pass ${count('pass')}/${runs} · inConfig ${count('inConfig')} · ` +
    `noHandControl ${count('noHandControl')} · translated ${count('translated')} · i18nValid ${count('i18nValid')} · ` +
    `wired ${count('wired')}${withTests ? ` · tests ${count('tests')}` : ''} · $${cost.toFixed(2)} in all`
);
