#!/usr/bin/env node
/**
 * META-18: tests tools/scripts/lint-delta.cjs on fixture workspaces.
 *
 * Each case builds a temporary git repo with a plain ESLint config (core rules only, so it needs
 * no plugin), commits a base, changes files and runs the check with `--root` and `--base`:
 * - a new warning in a touched file fails, and only the new message is listed; an existing
 *   warning in a touched or untouched file does not fail; removing one passes;
 * - a new file (untracked or committed) counts 0 at the base; a renamed file is compared with
 *   its old path; a file ESLint has no config for is left out;
 * - ESLINT_TYPED=1 in the environment does not change the count (the fixture config adds a
 *   rule when it is set, as the root config does);
 * - `--scope-only` classifies files without loading ESLint;
 * - usage, git and ESLint errors exit 2.
 *
 * Run: yarn lint:delta:test (CI: the Lint Affected step of .github/workflows/ci.yml).
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHECK = path.join(import.meta.dirname, 'lint-delta.cjs');
const CONFIG = [
  'export default [',
  '  {',
  "    files: ['**/*.js'],",
  '    rules: {',
  "      'no-unused-vars': 'warn',",
  "      ...(process.env.ESLINT_TYPED === '1' ? { 'no-empty': 'warn' } : {}),",
  '    },',
  '  },',
  '];',
  '',
].join('\n');
const BASE_FILES = {
  'eslint.config.mjs': CONFIG,
  'src/old.js': 'export const used = 1;\nconst unusedOld = 2;\n',
  'src/clean.js': 'export const clean = 1;\n',
  'notes.md': '# Notes\n',
};
const GIT_ID = [
  '-c',
  'user.name=lint-delta-test',
  '-c',
  'user.email=lint-delta-test@example.invalid',
];

const failures = [];
const temps = [];

/**
 * Writes files under a root.
 * @param {string} root The root.
 * @param {Record<string, string>} files Path → content.
 */
function write(root, files) {
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), content);
  }
}

/**
 * Runs git in a fixture.
 * @param {string} root The fixture root.
 * @param {string[]} args Git arguments.
 * @returns {string} Its stdout.
 */
function git(root, args) {
  return execFileSync('git', [...GIT_ID, ...args], { cwd: root, encoding: 'utf8' }).trim();
}

/**
 * Builds a fixture repo with the base files committed.
 * @param {Record<string, string>} [extra] More base files.
 * @returns {{ root: string, base: string }} The root and the base commit.
 */
function fixture(extra = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'lint-delta-'));
  temps.push(root);
  git(root, ['init', '-q']);
  write(root, { ...BASE_FILES, ...extra });
  git(root, ['add', '-A']);
  git(root, ['commit', '-q', '-m', 'base']);

  return { root, base: git(root, ['rev-parse', 'HEAD']) };
}

/**
 * Runs the check.
 * @param {string[]} args Its arguments.
 * @param {Record<string, string>} [env] Extra environment.
 * @returns {{ status: number | null, stdout: string, stderr: string }} The result.
 */
function run(args, env = {}) {
  const { ESLINT_TYPED, ...rest } = process.env;

  return spawnSync(process.execPath, [CHECK, ...args], {
    encoding: 'utf8',
    env: { ...rest, ...env },
  });
}

/**
 * Records a case.
 * @param {string} name The case name.
 * @param {string | null} problem What went wrong, or null.
 */
function verdict(name, problem) {
  if (problem) failures.push(`${name}: ${problem}`);
  else console.log(`✓ ${name}`);
}

/**
 * Runs the check with --json on a fixture after a change and checks the exit code and files.
 * @param {string} name The case name.
 * @param {(root: string) => void} change What the case does to the fixture.
 * @param {{ status: number, linted: Record<string, [number, number]>, listed?: string[], env?: Record<string, string> }} expected Exit code, `file: [base, head]` per linted file, and the listed messages.
 */
function expectDelta(name, change, expected) {
  const { root, base } = fixture();
  change(root);
  const result = run(['--json', '--root', root, '--base', base], expected.env);
  if (result.status !== expected.status) {
    verdict(name, `exit ${result.status}, expected ${expected.status}. ${result.stderr.trim()}`);

    return;
  }
  const report = JSON.parse(result.stdout);
  const linted = Object.fromEntries(
    report.results.map(entry => [entry.file, [entry.base, entry.head]])
  );
  const listed = report.results.flatMap(entry =>
    entry.grown.flatMap(rule => rule.warnings.map(w => w.message))
  );
  if (JSON.stringify(linted) !== JSON.stringify(expected.linted)) {
    verdict(name, `linted ${JSON.stringify(linted)}, expected ${JSON.stringify(expected.linted)}`);
  } else if (expected.listed && JSON.stringify(listed) !== JSON.stringify(expected.listed)) {
    verdict(name, `listed ${JSON.stringify(listed)}, expected ${JSON.stringify(expected.listed)}`);
  } else {
    verdict(name, null);
  }
}

/**
 * Runs the check and expects exit 2 with a message.
 * @param {string} name The case name.
 * @param {string[]} args Its arguments.
 * @param {RegExp} message What stderr must say.
 */
function expectFatal(name, args, message) {
  const result = run(args);
  verdict(
    name,
    result.status === 2 && message.test(result.stderr)
      ? null
      : `exit ${result.status}, stderr "${result.stderr.trim()}"; expected exit 2 and ${message}`
  );
}

try {
  expectDelta('an untouched file with warnings does not fail', () => {}, { status: 0, linted: {} });
  expectDelta(
    'editing a file that has a warning, without adding one, passes',
    root => write(root, { 'src/old.js': `${BASE_FILES['src/old.js']}export const more = 3;\n` }),
    { status: 0, linted: { 'src/old.js': [1, 1] } }
  );
  expectDelta(
    'a new warning in a touched file fails, and only it is listed',
    root => write(root, { 'src/old.js': `${BASE_FILES['src/old.js']}const unusedNew = 4;\n` }),
    {
      status: 1,
      linted: { 'src/old.js': [1, 2] },
      listed: ["'unusedNew' is assigned a value but never used."],
    }
  );
  expectDelta(
    'removing a warning passes',
    root => write(root, { 'src/old.js': 'export const used = 1;\n' }),
    { status: 0, linted: { 'src/old.js': [1, 0] } }
  );
  expectDelta(
    'an untracked new file counts 0 at the base',
    root => write(root, { 'src/new.js': 'const unusedHere = 1;\n' }),
    { status: 1, linted: { 'src/new.js': [0, 1] } }
  );
  expectDelta(
    'a committed new file counts 0 at the base',
    root => {
      write(root, { 'src/added.js': 'const unusedAdded = 1;\n' });
      git(root, ['add', '-A']);
      git(root, ['commit', '-q', '-m', 'add']);
    },
    { status: 1, linted: { 'src/added.js': [0, 1] } }
  );
  expectDelta(
    'a renamed file is compared with its old path',
    root => {
      git(root, ['mv', 'src/old.js', 'src/moved.js']);
      git(root, ['commit', '-q', '-m', 'move']);
    },
    { status: 0, linted: { 'src/moved.js': [1, 1] } }
  );
  expectDelta(
    'a file ESLint has no config for is left out',
    root => write(root, { 'notes.md': '# Notes\n\nMore.\n' }),
    { status: 0, linted: {} }
  );
  expectDelta(
    'ESLINT_TYPED=1 does not change the count (fast profile always)',
    root =>
      write(root, {
        'src/clean.js':
          'export const clean = 1;\nexport function empty(flag) {\n  if (flag) {\n  }\n}\n',
      }),
    { status: 0, linted: { 'src/clean.js': [0, 0] }, env: { ESLINT_TYPED: '1' } }
  );

  const scoped = fixture();
  write(scoped.root, {
    'eslint.config.mjs': "throw new Error('ESLint must not load');\n",
    'libs/a/a.ts': '',
    'libs/a/a.html': '',
    'libs/a/a.scss': '',
    'apps/x/public/i18n/ca.json': '{}\n',
    'README.md': '',
    'other.txt': '',
  });
  const scope = run(['--scope-only', '--json', '--root', scoped.root, '--base', scoped.base]);
  const groups = scope.status === 0 ? JSON.parse(scope.stdout).partition : null;
  const wanted = {
    ts: ['libs/a/a.ts'],
    html: ['libs/a/a.html'],
    scss: ['libs/a/a.scss'],
    i18n: ['apps/x/public/i18n/ca.json'],
    docs: ['README.md'],
    other: ['eslint.config.mjs', 'other.txt'],
  };
  verdict(
    '--scope-only classifies the touched files without loading ESLint',
    JSON.stringify(groups) === JSON.stringify(wanted)
      ? null
      : `exit ${scope.status}, partition ${JSON.stringify(groups)} ${scope.stderr.trim()}`
  );
  expectFatal(
    'a config that throws stops with exit 2',
    ['--root', scoped.root, '--base', scoped.base],
    /ESLint failed: .*ESLint must not load/
  );

  const plain = fixture();
  expectFatal('an unknown argument stops with exit 2', ['--nope'], /Unknown argument: --nope/);
  expectFatal('--base without a value stops with exit 2', ['--base'], /--base needs a value/);
  expectFatal(
    'a base that is no commit stops with exit 2',
    ['--root', plain.root, '--base', 'no-such-ref'],
    /git rev-parse .*no-such-ref/
  );
  expectFatal(
    'no origin/develop and no --base stops with exit 2',
    ['--root', plain.root],
    /no merge base with origin\/develop .*pass --base/
  );
} finally {
  temps.forEach(dir => rmSync(dir, { recursive: true, force: true }));
}

if (failures.length > 0) {
  console.error(`\n✗ lint-delta tests: ${failures.length} failed\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log('\n✓ lint-delta tests passed');
}
