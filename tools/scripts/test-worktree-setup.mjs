#!/usr/bin/env node
/**
 * META-34: tools/scripts/worktree-setup.cjs, which makes every checkout run its own .husky
 * hooks and gets a linked worktree ready to commit.
 *
 * Every case builds a throwaway repository under the system temp folder: a main checkout on
 * develop, whose core.hooksPath points at its own `.husky/_` with husky's runner (the state
 * before META-34), a linked worktree on a `worktree-*` branch whose `.husky` hooks differ from
 * the main checkout's, and a second worktree on a branch without `.husky`. The hooks append a
 * line to the file in $HOOK_LOG, so a case reads which checkout's hook ran. Git runs without
 * the user's global and system config, and any GIT_* variable of the caller is dropped.
 *
 * Run: yarn worktree-setup:test (CI: the Lint Affected step of .github/workflows/ci.yml).
 * WORKTREE_SETUP_SCRIPT=<path> runs the cases against another copy of the script (mutation runs).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const SCRIPT = path.resolve(
  process.env.WORKTREE_SETUP_SCRIPT ?? path.join(ROOT, 'tools/scripts/worktree-setup.cjs')
);
const HUSKY_RUNNER = path.join(ROOT, 'node_modules/husky/husky');
const BASE_ENV = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_'))
);
const GIT_ENV = {
  ...BASE_ENV,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 'Fixture',
  GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Fixture',
  GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
};
const IGNORED = [
  'node_modules/',
  '.husky/_/',
  'apps/eco-store/.env',
  'apps/eco-store/pocketbase/pocketbase',
  'apps/eco-store/pocketbase/pb_data/',
  'apps/eco-store/pocketbase/pb_migrations/',
];
const log = name => `echo "${name}" >> "$HOOK_LOG"\n`;
const MAIN_HOOKS = {
  '.husky/pre-commit': log('main pre-commit'),
  '.husky/commit-msg': 'echo "main commit-msg $(head -n 1 "$1")" >> "$HOOK_LOG"\n',
  '.husky/pre-push': log('main pre-push'),
};
const WORKTREE_HOOKS = {
  '.husky/pre-commit': [
    log('worktree pre-commit'),
    'if [ -n "$FIXTURE_FAIL" ]; then exit 3; fi',
    'if [ -n "$FIXTURE_FALSE" ]; then false; echo "after false" >> "$HOOK_LOG"; fi',
    'if [ -n "$FIXTURE_TOOL" ]; then fixture-tool; fi',
    '',
  ].join('\n'),
  '.husky/commit-msg': 'echo "worktree commit-msg $(head -n 1 "$1")" >> "$HOOK_LOG"\n',
  '.husky/pre-push': 'echo "worktree pre-push $1" >> "$HOOK_LOG"\n',
};

const failures = [];
const bases = [];
let passed = 0;

/**
 * Runs git in a fixture checkout.
 * @param {string} dir The checkout, or a folder inside it.
 * @param {string[]} args The git arguments.
 * @param {Record<string, string>} [env] Extra environment.
 * @returns {{ status: number | null, out: string }} Exit status and output.
 */
function git(dir, args, env = {}) {
  const result = spawnSync('git', args, {
    cwd: dir,
    env: { ...GIT_ENV, ...env },
    encoding: 'utf8',
  });

  return { status: result.status, out: `${result.stdout}${result.stderr}`.trim() };
}

/**
 * Runs git and stops the case when it fails.
 * @param {string} dir The checkout.
 * @param {string[]} args The git arguments.
 * @returns {string} Its output.
 */
function gitOk(dir, args) {
  const { status, out } = git(dir, args);

  if (status !== 0) throw new Error(`git ${args.join(' ')} failed in ${dir}: ${out}`);

  return out;
}

/**
 * Writes files, creating their folders.
 * @param {string} dir The base folder.
 * @param {Record<string, string>} files Path → content.
 * @param {number} [mode] File mode.
 */
function write(dir, files, mode = 0o644) {
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), content);
    fs.chmodSync(path.join(dir, file), mode);
  }
}

/**
 * Builds the fixture: main checkout, `wt` worktree on worktree-foo, `old` worktree without .husky.
 * @returns {{ base: string, main: string, wt: string, old: string, logFile: string, env: Record<string, string> }} The fixture.
 */
function fixture() {
  const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'worktree-setup-')));
  const main = path.join(base, 'main');
  const logFile = path.join(base, 'hooks.log');

  bases.push(base);
  fs.mkdirSync(main);
  gitOk(main, ['init', '-q', '-b', 'develop']);
  write(main, {
    '.gitignore': `${IGNORED.join('\n')}\n`,
    'README.md': 'fixture\n',
    'branchNameLint.json': fs.readFileSync(path.join(ROOT, 'branchNameLint.json'), 'utf8'),
  });
  write(main, MAIN_HOOKS, 0o755);
  gitOk(main, ['add', '-A']);
  gitOk(main, ['commit', '-q', '-m', 'chore: main']);

  gitOk(main, ['switch', '-q', '-c', 'chore/abc-wt']);
  write(main, WORKTREE_HOOKS, 0o755);
  gitOk(main, ['commit', '-q', '-am', 'chore: worktree hooks']);
  gitOk(main, ['switch', '-q', '-c', 'chore/abc-old', 'develop']);
  gitOk(main, ['rm', '-q', '-r', '.husky']);
  gitOk(main, ['commit', '-q', '-m', 'chore: no husky']);
  gitOk(main, ['switch', '-q', 'develop']);

  const wt = path.join(base, 'wt');
  const old = path.join(base, 'old');

  gitOk(main, ['worktree', 'add', '-q', '-b', 'worktree-foo', wt, 'chore/abc-wt']);
  gitOk(main, ['worktree', 'add', '-q', old, 'chore/abc-old']);

  // The main checkout's ignored files (no pb_migrations), and the husky state before META-34.
  write(main, {
    'apps/eco-store/.env': 'FIXTURE=1\n',
    'apps/eco-store/pocketbase/pocketbase': 'binary\n',
    'apps/eco-store/pocketbase/pb_data/data.db': 'db\n',
  });
  fs.mkdirSync(path.join(main, 'node_modules'));
  if (!fs.existsSync(HUSKY_RUNNER)) throw new Error(`${HUSKY_RUNNER} is missing: run yarn install`);
  write(main, { '.husky/_/h': fs.readFileSync(HUSKY_RUNNER, 'utf8') }, 0o755);
  for (const hook of ['pre-commit', 'commit-msg', 'pre-push', 'post-checkout']) {
    write(main, { [`.husky/_/${hook}`]: '#!/usr/bin/env sh\n. "$(dirname "$0")/h"\n' }, 0o755);
  }
  gitOk(main, ['config', 'core.hooksPath', path.join(main, '.husky/_')]);

  const xdg = path.join(base, 'xdg');

  fs.mkdirSync(xdg);

  return { base, main, wt, old, logFile, env: { HOOK_LOG: logFile, XDG_CONFIG_HOME: xdg } };
}

/**
 * Runs the setup script.
 * @param {string} dir The folder it runs from.
 * @param {string[]} args Its arguments.
 * @param {Record<string, string>} [env] Extra environment.
 * @returns {{ status: number | null, out: string }} Exit status and output.
 */
function setup(dir, args, env = {}) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: dir,
    env: { ...GIT_ENV, ...env },
    encoding: 'utf8',
  });

  return { status: result.status, out: `${result.stdout}${result.stderr}`.trim() };
}

/**
 * Gives a worktree a node_modules folder, so the setup does not install.
 * @param {string} dir The worktree.
 */
function fakeInstall(dir) {
  write(
    dir,
    { 'node_modules/.bin/fixture-tool': '#!/bin/sh\necho "worktree tool" >> "$HOOK_LOG"\n' },
    0o755
  );
}

/**
 * Commits one file and returns what the hooks logged.
 * @param {{ logFile: string, env: Record<string, string> }} fx The fixture.
 * @param {string} dir The checkout, or a folder inside it.
 * @param {string} message The commit message.
 * @param {Record<string, string>} [env] Extra environment.
 * @returns {{ status: number | null, out: string, lines: string[] }} The commit's result and the log.
 */
function commit(fx, dir, message, env = {}) {
  fs.rmSync(fx.logFile, { force: true });
  const file = `change-${Math.random().toString(36).slice(2)}.txt`;

  fs.writeFileSync(path.join(dir, file), `${message}\n`);
  gitOk(dir, ['add', file]);
  const result = git(dir, ['commit', '-q', '-m', message], { ...fx.env, ...env });

  return { ...result, lines: readLog(fx) };
}

/**
 * Reads what the hooks logged.
 * @param {{ logFile: string }} fx The fixture.
 * @returns {string[]} The lines.
 */
function readLog(fx) {
  return fs.existsSync(fx.logFile)
    ? fs.readFileSync(fx.logFile, 'utf8').trim().split('\n').filter(Boolean)
    : [];
}

/**
 * Asserts a condition.
 * @param {boolean} condition The condition.
 * @param {string} message What failed.
 */
function expect(condition, message) {
  if (!condition) throw new Error(message);
}

/**
 * Runs one case.
 * @param {string} name The case.
 * @param {() => void} run The case body; throws on failure.
 */
function test(name, run) {
  try {
    run();
    passed++;
  } catch (error) {
    failures.push(`${name}\n    ${error.message.replaceAll('\n', '\n    ')}`);
  }
}

/**
 * Builds the fixture and runs the setup in `wt` with a valid branch.
 * @returns {ReturnType<typeof fixture> & { result: { status: number | null, out: string } }} The fixture.
 */
function readyFixture() {
  const fx = fixture();

  fakeInstall(fx.wt);
  const result = setup(fx.wt, ['--branch', 'chore/abc-thing']);

  expect(result.status === 0, `setup exited ${result.status}:\n${result.out}`);

  return { ...fx, result };
}

test('before the setup, a worktree commit runs the main checkout hooks (the problem)', () => {
  const fx = fixture();
  const run = commit(fx, fx.wt, 'feat: before');

  expect(run.status === 0, `commit failed: ${run.out}`);
  expect(
    JSON.stringify(run.lines) ===
      JSON.stringify(['main pre-commit', 'main commit-msg feat: before']),
    `log: ${JSON.stringify(run.lines)}`
  );
});

test('the setup points the shared core.hooksPath at an executable dispatcher', () => {
  const fx = readyFixture();
  const dispatch = path.join(fs.realpathSync(path.join(fx.main, '.git')), 'husky-dispatch');
  const value = gitOk(fx.main, ['config', '--get', 'core.hooksPath']);

  expect(value === dispatch, `core.hooksPath is ${value}, expected ${dispatch}`);
  expect(
    gitOk(fx.wt, ['config', '--get', 'core.hooksPath']) === dispatch,
    'the worktree reads another value'
  );
  for (const name of [
    'h',
    'pre-commit',
    'commit-msg',
    'pre-push',
    'post-checkout',
    'pre-auto-gc',
  ]) {
    const mode = fs.statSync(path.join(dispatch, name)).mode;

    expect((mode & 0o111) === 0o111, `${name} is not executable (${mode.toString(8)})`);
  }
  expect(
    /core\.hooksPath .*\.husky\/_ → /.test(fx.result.out),
    `the output does not say what changed:\n${fx.result.out}`
  );
});

test('after the setup, a worktree commit runs its own pre-commit and commit-msg', () => {
  const fx = readyFixture();
  const run = commit(fx, fx.wt, 'feat: after');

  expect(run.status === 0, `commit failed: ${run.out}`);
  expect(
    JSON.stringify(run.lines) ===
      JSON.stringify(['worktree pre-commit', 'worktree commit-msg feat: after']),
    `log: ${JSON.stringify(run.lines)}`
  );
});

test('after the setup, the main checkout still runs its own hooks', () => {
  const fx = readyFixture();
  const run = commit(fx, fx.main, 'feat: main');

  expect(run.status === 0, `commit failed: ${run.out}`);
  expect(
    JSON.stringify(run.lines) === JSON.stringify(['main pre-commit', 'main commit-msg feat: main']),
    `log: ${JSON.stringify(run.lines)}`
  );
});

test('a commit from a subfolder of the worktree runs the worktree hooks', () => {
  const fx = readyFixture();
  const sub = path.join(fx.wt, 'deep/folder');

  fs.mkdirSync(sub, { recursive: true });
  const run = commit(fx, sub, 'feat: sub');

  expect(run.status === 0, `commit failed: ${run.out}`);
  expect(run.lines[0] === 'worktree pre-commit', `log: ${JSON.stringify(run.lines)}`);
});

test("a hook that fails stops the commit with husky's message", () => {
  const fx = readyFixture();
  const head = gitOk(fx.wt, ['rev-parse', 'HEAD']);
  const run = commit(fx, fx.wt, 'feat: fail', { FIXTURE_FAIL: '1' });

  expect(run.status !== 0, 'the commit went through');
  expect(run.out.includes('husky - pre-commit script failed (code 3)'), `output: ${run.out}`);
  expect(gitOk(fx.wt, ['rev-parse', 'HEAD']) === head, 'HEAD moved');
});

test('hooks run under sh -e, as with husky', () => {
  const fx = readyFixture();
  const run = commit(fx, fx.wt, 'feat: false', { FIXTURE_FALSE: '1' });

  expect(run.status !== 0, 'the commit went through');
  expect(
    !run.lines.includes('after false'),
    `the hook went on after false: ${JSON.stringify(run.lines)}`
  );
});

test("hooks find the tools in the checkout's node_modules/.bin", () => {
  const fx = readyFixture();
  const run = commit(fx, fx.wt, 'feat: tool', { FIXTURE_TOOL: '1' });

  expect(run.status === 0, `commit failed: ${run.out}`);
  expect(run.lines.includes('worktree tool'), `log: ${JSON.stringify(run.lines)}`);
});

test('HUSKY set to 0 skips the hooks, as with husky', () => {
  const fx = readyFixture();
  const run = commit(fx, fx.wt, 'feat: skipped', { HUSKY: '0' });

  expect(run.status === 0, `commit failed: ${run.out}`);
  expect(run.lines.length === 0, `log: ${JSON.stringify(run.lines)}`);
});

test('a push runs the pre-push of the worktree it starts from', () => {
  const fx = readyFixture();
  const remote = path.join(fx.base, 'remote.git');

  gitOk(fx.base, ['init', '-q', '--bare', remote]);
  gitOk(fx.main, ['remote', 'add', 'origin', remote]);
  fs.rmSync(fx.logFile, { force: true });
  const run = git(fx.wt, ['push', '-q', 'origin', 'HEAD:refs/heads/fixture'], fx.env);

  expect(run.status === 0, `push failed: ${run.out}`);
  expect(
    JSON.stringify(readLog(fx)) === JSON.stringify(['worktree pre-push origin']),
    `log: ${JSON.stringify(readLog(fx))}`
  );
});

test('a checkout without a .husky folder cannot commit, and says why', () => {
  const fx = readyFixture();
  const head = gitOk(fx.old, ['rev-parse', 'HEAD']);
  const run = commit(fx, fx.old, 'feat: old');

  expect(run.status !== 0, 'the commit went through');
  expect(run.out.includes('has no .husky folder'), `output: ${run.out}`);
  expect(gitOk(fx.old, ['rev-parse', 'HEAD']) === head, 'HEAD moved');
  const checkout = git(fx.old, ['switch', '-q', '-c', 'chore/abc-old2'], fx.env);

  expect(checkout.status === 0, `a post-checkout without .husky failed: ${checkout.out}`);
});

test('a hook the checkout does not have is skipped', () => {
  const fx = readyFixture();

  fs.rmSync(path.join(fx.wt, '.husky/pre-commit'));
  const run = commit(fx, fx.wt, 'feat: no pre-commit');

  expect(run.status === 0, `commit failed: ${run.out}`);
  expect(
    JSON.stringify(run.lines) === JSON.stringify(['worktree commit-msg feat: no pre-commit']),
    `log: ${JSON.stringify(run.lines)}`
  );
});

test("the setup links the main checkout's ignored files and keeps the worktree's own", () => {
  const fx = fixture();

  fakeInstall(fx.wt);
  write(fx.wt, { 'apps/eco-store/.env': 'OWN=1\n' });
  const result = setup(fx.wt, ['--branch', 'chore/abc-thing']);
  const linked = file => path.join(fx.wt, file);

  expect(result.status === 0, `setup exited ${result.status}:\n${result.out}`);
  expect(
    !fs.lstatSync(linked('apps/eco-store/.env')).isSymbolicLink(),
    'the worktree .env was replaced'
  );
  expect(
    fs.readFileSync(linked('apps/eco-store/.env'), 'utf8') === 'OWN=1\n',
    'the worktree .env changed'
  );
  for (const file of [
    'apps/eco-store/pocketbase/pocketbase',
    'apps/eco-store/pocketbase/pb_data',
  ]) {
    const target = fs.readlinkSync(linked(file));

    expect(target === path.join(fx.main, file), `${file} → ${target}`);
  }
  expect(
    !fs.existsSync(linked('apps/eco-store/pocketbase/pb_migrations')),
    'pb_migrations appeared'
  );
  expect(result.out.includes('pb_migrations is not in the main checkout'), `output: ${result.out}`);
});

test('the setup will not finish on a worktree-* branch without --branch', () => {
  const fx = fixture();

  fakeInstall(fx.wt);
  const result = setup(fx.wt, []);

  expect(result.status === 1, `setup exited ${result.status}`);
  expect(
    result.out.includes('worktree-foo') && result.out.includes('--branch'),
    `output: ${result.out}`
  );
  expect(
    commit(fx, fx.wt, 'feat: hooks anyway').lines[0] === 'worktree pre-commit',
    'the hooks were not installed'
  );
});

test('the setup refuses a branch name the branch lint rejects', () => {
  const fx = fixture();

  fakeInstall(fx.wt);
  for (const name of ['wip/abc-x', 'feature/abc-x', 'develop', 'chore/']) {
    const result = setup(fx.wt, ['--branch', name]);

    expect(result.status === 1, `--branch ${name} exited ${result.status}:\n${result.out}`);
  }
  expect(gitOk(fx.wt, ['branch', '--show-current']) === 'worktree-foo', 'the branch was renamed');
});

test('the setup renames the branch', () => {
  const fx = readyFixture();

  expect(
    gitOk(fx.wt, ['branch', '--show-current']) === 'chore/abc-thing',
    'the branch was not renamed'
  );
  expect(fx.result.out.includes('worktree-foo → chore/abc-thing'), `output: ${fx.result.out}`);
});

test('the setup installs packages when node_modules is missing, unless --no-install', () => {
  const fx = fixture();
  const bin = path.join(fx.base, 'bin');

  write(
    bin,
    { yarn: '#!/bin/sh\necho "yarn $* $(pwd)" >> "$HOOK_LOG"\nmkdir node_modules\n' },
    0o755
  );
  const skipped = setup(fx.wt, ['--branch', 'chore/abc-thing', '--no-install'], fx.env);

  expect(
    skipped.status === 1 && skipped.out.includes('run yarn install'),
    `--no-install: ${skipped.out}`
  );
  expect(readLog(fx).length === 0, 'yarn ran with --no-install');
  const installed = setup(fx.wt, [], { ...fx.env, PATH: `${bin}:${process.env.PATH}` });

  expect(installed.status === 0, `setup exited ${installed.status}:\n${installed.out}`);
  expect(
    JSON.stringify(readLog(fx)) === JSON.stringify([`yarn install --immutable ${fx.wt}`]),
    `log: ${readLog(fx)}`
  );
});

test('the setup can run again', () => {
  const fx = readyFixture();
  const again = setup(fx.wt, ['--branch', 'chore/abc-thing']);

  expect(again.status === 0, `second run exited ${again.status}:\n${again.out}`);
  expect(again.out.includes('core.hooksPath already'), `output: ${again.out}`);
  expect(again.out.includes('Kept apps/eco-store/pocketbase/pocketbase'), `output: ${again.out}`);
  expect(
    commit(fx, fx.wt, 'feat: again').lines[0] === 'worktree pre-commit',
    'the hooks stopped working'
  );
});

test('in the main checkout, the setup only installs the dispatcher', () => {
  const fx = fixture();
  const result = setup(fx.main, []);

  expect(result.status === 0, `setup exited ${result.status}:\n${result.out}`);
  expect(
    !result.out.includes('Linked') && !result.out.includes('node_modules'),
    `output: ${result.out}`
  );
  expect(gitOk(fx.main, ['branch', '--show-current']) === 'develop', 'the branch changed');
  expect(
    commit(fx, fx.wt, 'feat: from main').lines[0] === 'worktree pre-commit',
    'the dispatcher is not active'
  );
});

test('--hooks-only in a worktree neither links nor renames', () => {
  const fx = fixture();
  const result = setup(fx.wt, ['--hooks-only']);

  expect(result.status === 0, `setup exited ${result.status}:\n${result.out}`);
  expect(
    !fs.existsSync(path.join(fx.wt, 'apps/eco-store/pocketbase/pocketbase')),
    'it linked files'
  );
  expect(gitOk(fx.wt, ['branch', '--show-current']) === 'worktree-foo', 'it renamed the branch');
});

test('wrong arguments exit 2 without touching the repository', () => {
  const fx = fixture();

  for (const args of [['--bogus'], ['--branch'], ['--branch', '--no-install'], ['stray']]) {
    const result = setup(fx.wt, args);

    expect(result.status === 2, `${args.join(' ')} exited ${result.status}`);
  }
  expect(
    gitOk(fx.main, ['config', '--get', 'core.hooksPath']) === path.join(fx.main, '.husky/_'),
    'core.hooksPath changed'
  );
});

test('package.json runs the setup from husky-install and worktree:setup, and has this test', () => {
  const scripts = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts;

  expect(
    scripts['worktree:setup'] === 'node tools/scripts/worktree-setup.cjs',
    `worktree:setup: ${scripts['worktree:setup']}`
  );
  expect(
    scripts['husky-install'] === 'node tools/scripts/worktree-setup.cjs --hooks-only',
    `husky-install: ${scripts['husky-install']}`
  );
  expect(
    scripts['worktree-setup:test'] === 'node tools/scripts/test-worktree-setup.mjs',
    'worktree-setup:test is missing'
  );
});

if (!process.env.KEEP_FIXTURES)
  for (const base of bases) fs.rmSync(base, { recursive: true, force: true });

for (const failure of failures) console.error(`✗ ${failure}`);
console.log(
  `${passed} passed, ${failures.length} failed${process.env.KEEP_FIXTURES ? ` (fixtures kept: ${bases.join(' ')})` : ''}`
);
process.exitCode = failures.length ? 1 : 0;
