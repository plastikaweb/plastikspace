#!/usr/bin/env node
/**
 * META-22: tools/scripts/check-commit-refs.cjs, the commit-msg check for what commitlint
 * cannot see (the branch's ClickUp ID, a task ID on eco code, a CHANGELOG bullet).
 *
 * Every case builds a throwaway git repository under the system temp folder, with its own
 * develop, origin/develop and branch, stages files there and runs the script on a message
 * file, as .husky/commit-msg does. Git runs without the user's global and system config. The
 * last cases go through `git commit` itself, with the script as the fixture's commit-msg hook,
 * to check the index the hook sees in `git commit -a` and `git commit <paths>`.
 *
 * Run: yarn commit-refs:test (CI: the Lint Affected step of .github/workflows/ci.yml).
 * COMMIT_REFS_SCRIPT=<path> runs the cases against another copy of the script (mutation runs).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const SCRIPT = path.resolve(
  process.env.COMMIT_REFS_SCRIPT ?? path.join(ROOT, 'tools/scripts/check-commit-refs.cjs')
);
const CU = '123kjkdqv3d';
const OTHER_CU = '123kjkdr15x';
const BRANCH = `feat/${CU}-thing`;
const GIT_ENV = {
  ...process.env,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 'Fixture',
  GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Fixture',
  GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
};

const failures = [];
const repos = [];
let passed = 0;

/**
 * Runs git in a fixture repository.
 * @param {string} dir The repository.
 * @param {string[]} args The git arguments.
 * @returns {{ status: number | null, out: string }} Exit status and output.
 */
function git(dir, args) {
  const result = spawnSync('git', args, { cwd: dir, env: GIT_ENV, encoding: 'utf8' });

  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

/**
 * Runs git and stops the test when it fails.
 * @param {string} dir The repository.
 * @param {string[]} args The git arguments.
 */
function gitOk(dir, args) {
  const { status, out } = git(dir, args);

  if (status !== 0) throw new Error(`git ${args.join(' ')} failed in ${dir}: ${out}`);
}

/**
 * Writes files into a fixture repository.
 * @param {string} dir The repository.
 * @param {Record<string, string>} files Path → content.
 */
function write(dir, files) {
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), content);
  }
}

/**
 * Commits files on the current branch of a fixture repository.
 * @param {string} dir The repository.
 * @param {Record<string, string>} files Path → content.
 * @param {string} message The commit message.
 */
function commit(dir, files, message) {
  write(dir, files);
  gitOk(dir, ['add', '-A']);
  gitOk(dir, ['commit', '-q', '-m', message]);
}

/**
 * Builds a repository with develop, origin/develop and a feature branch.
 * @param {string} branch The branch to leave checked out.
 * @param {string} [developChangelog] An extra CHANGELOG.md line already on develop.
 * @returns {string} The repository folder.
 */
function makeRepo(branch, developChangelog = '') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'commit-refs-'));

  repos.push(dir);
  gitOk(dir, ['init', '-q', '-b', 'develop']);
  commit(
    dir,
    {
      'CHANGELOG.md': `# Changelog\n\n## [2026-11-01] - Old\n\n- Old entry ([#86aaaaaa1](https://app.clickup.com/t/86aaaaaa1))\n${developChangelog}`,
      'README.md': 'Fixture.\n',
      'libs/eco-store/cart/src/cart.ts': 'export const cart = 1;\n',
      'libs/shared/util/src/util.ts': 'export const util = 1;\n',
    },
    'chore: start the fixture'
  );
  gitOk(dir, ['update-ref', 'refs/remotes/origin/develop', 'HEAD']);
  gitOk(dir, ['switch', '-q', '-c', branch]);

  return dir;
}

/**
 * Adds a CHANGELOG.md bullet to the working copy.
 * @param {string} dir The repository.
 * @param {string} line The bullet.
 */
function addBullet(dir, line) {
  const file = path.join(dir, 'CHANGELOG.md');
  const [title, ...rest] = fs.readFileSync(file, 'utf8').split('\n\n');

  fs.writeFileSync(file, [title, `## [2026-11-24] - New\n\n${line}`, ...rest].join('\n\n'));
}

/**
 * Runs the script on a message, as .husky/commit-msg does.
 * @param {string} dir The repository.
 * @param {string} message The commit message.
 * @returns {{ status: number | null, out: string }} Exit status and output.
 */
function runCheck(dir, message) {
  const messageFile = path.join(dir, '.git', 'COMMIT_EDITMSG');

  fs.writeFileSync(messageFile, message);
  const result = spawnSync(process.execPath, [SCRIPT, messageFile], {
    cwd: dir,
    env: GIT_ENV,
    encoding: 'utf8',
  });

  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

/**
 * Records one case.
 * @param {string} name The case name.
 * @param {{ status: number | null, out: string }} result What the script did.
 * @param {string[] | null} expected null to pass; otherwise texts the refusal must hold.
 */
function expect(name, result, expected) {
  const ok =
    expected === null
      ? result.status === 0
      : result.status === 1 && expected.every(text => result.out.includes(text));

  if (ok) {
    passed++;
    console.log(`✓ ${name}`);
  } else {
    failures.push(`${name}: exit ${result.status}, output: ${result.out.slice(0, 400)}`);
  }
}

/**
 * Stages files in a fresh repository and checks a message.
 * @param {{ branch?: string, files?: Record<string, string>, message: string, before?: (dir: string) => void }} options The case.
 * @returns {{ status: number | null, out: string }} What the script did.
 */
function stageAndCheck({ branch = BRANCH, files = {}, message, before }) {
  const dir = makeRepo(branch);

  before?.(dir);
  write(dir, files);
  gitOk(dir, ['add', '-A']);

  return runCheck(dir, message);
}

const TOOL_FILE = { 'tools/a.js': 'a\n' };
const ECO_FILE = { 'libs/eco-store/cart/src/cart.ts': 'export const cart = 2;\n' };

try {
  // 1. ClickUp ID of the branch in the header.
  expect(
    'ClickUp: a header with the branch ID passes',
    stageAndCheck({ files: TOOL_FILE, message: `chore(tools): #${CU} add a\n` }),
    null
  );
  expect(
    'ClickUp: a header without it fails and shows the fixed header',
    stageAndCheck({ files: TOOL_FILE, message: 'chore(tools): add a\n' }),
    [`branch ${BRANCH}`, `chore(tools): #${CU} add a`]
  );
  expect(
    'ClickUp: another task ID fails',
    stageAndCheck({ files: TOOL_FILE, message: `chore(tools): #${OTHER_CU} add a\n` }),
    [`#${CU}`]
  );
  expect(
    'ClickUp: the ID in the body only fails',
    stageAndCheck({ files: TOOL_FILE, message: `chore(tools): add a\n\nRefs #${CU}\n` }),
    [`#${CU}`]
  );
  expect(
    'ClickUp: an 86-style branch ID is required too',
    stageAndCheck({
      branch: 'fix/86c9kxqvh-csp',
      files: TOOL_FILE,
      message: 'chore(tools): add a\n',
    }),
    ['#86c9kxqvh']
  );
  expect(
    'ClickUp: a branch with no ClickUp ID is not checked',
    stageAndCheck({
      branch: 'docs/readme-words',
      files: TOOL_FILE,
      message: 'chore(tools): add a\n',
    }),
    null
  );
  expect(
    'ClickUp: a detached HEAD is not checked',
    stageAndCheck({
      files: TOOL_FILE,
      message: 'chore(tools): add a\n',
      before: dir => gitOk(dir, ['switch', '-q', '--detach']),
    }),
    null
  );
  expect(
    'Message: comments and the scissors part are not the header',
    stageAndCheck({
      files: TOOL_FILE,
      message: `# chore(tools): #${CU} in a comment\n\nchore(tools): add a\n# ------------------------ >8 ------------------------\n#${CU}\n`,
    }),
    [`#${CU}`]
  );
  expect(
    'Message: a header after comment lines is read',
    stageAndCheck({
      files: TOOL_FILE,
      message: `# Please enter the commit message\n\nchore(tools): #${CU} add a\n# ------------------------ >8 ------------------------\nchore(tools): add a\n`,
    }),
    null
  );
  for (const message of [
    "Merge branch 'develop' into feat/x\n",
    'Revert "chore(tools): add a"\n',
    'fixup! chore(tools): add a\n',
    'squash! chore(tools): add a\n',
  ]) {
    expect(
      `Skipped message: ${message.trim()}`,
      stageAndCheck({ files: { ...ECO_FILE, ...TOOL_FILE }, message }),
      null
    );
  }
  expect(
    'Skipped: a merge in progress (MERGE_HEAD)',
    stageAndCheck({
      files: ECO_FILE,
      message: 'feat(eco-store): add a\n',
      before: dir =>
        fs.writeFileSync(path.join(dir, '.git', 'MERGE_HEAD'), git(dir, ['rev-parse', 'HEAD']).out),
    }),
    null
  );

  // 2. Task ID on eco code.
  expect(
    'Task ID: eco code with BOT-04 passes',
    stageAndCheck({ files: ECO_FILE, message: `test(eco-store): #${CU} BOT-04 add a\n` }),
    null
  );
  expect(
    'Task ID: eco code without one fails and lists the file',
    stageAndCheck({ files: ECO_FILE, message: `test(eco-store): #${CU} add a\n` }),
    ['names no task ID', 'libs/eco-store/cart/src/cart.ts']
  );
  expect(
    'Task ID: an eco-admin row (AP-0 0.7) passes',
    stageAndCheck({
      files: { 'apps/eco-admin/src/main.ts': 'x\n' },
      message: `test(eco-admin): #${CU} AP-0 0.7 add a\n`,
    }),
    null
  );
  for (const id of ['FOO-12', 'UTF-8', 'BOT-4']) {
    expect(
      `Task ID: ${id} is not one`,
      stageAndCheck({ files: ECO_FILE, message: `test(eco-store): #${CU} ${id} add a\n` }),
      ['names no task ID']
    );
  }
  expect(
    'Task ID: one in the body only fails',
    stageAndCheck({ files: ECO_FILE, message: `test(eco-store): #${CU} add a\n\nBOT-04\n` }),
    ['names no task ID']
  );
  expect(
    'Task ID: eco Markdown alone needs none',
    stageAndCheck({
      files: { 'apps/eco-store/README.md': 'x\n' },
      message: `docs(eco-store): #${CU} add a\n`,
    }),
    null
  );
  for (const file of [
    'libs/shared/util/src/util.ts',
    'libs/ecology/src/a.ts',
    'apps/eco-storefront/a.ts',
  ]) {
    expect(
      `Task ID: ${file} is not eco code`,
      stageAndCheck({ files: { [file]: 'x\n' }, message: `test(shared): #${CU} add a\n` }),
      null
    );
  }
  for (const file of [
    'apps/eco-store/src/main.ts',
    'apps/eco-a11y-e2e/src/a.spec.ts',
    'apps/eco-admin/src/main.ts',
    'apps/eco-admin-e2e/src/a.spec.ts',
    'libs/eco/styles/a.scss',
    'libs/eco-admin/auth/a.ts',
    'apps/eco-store/pocketbase/pb_schema.json',
  ]) {
    expect(
      `Task ID: ${file} is eco code`,
      stageAndCheck({ files: { [file]: 'x\n' }, message: `test(eco): #${CU} add a\n` }),
      ['names no task ID']
    );
  }
  expect(
    'Task ID: a deleted eco file counts',
    stageAndCheck({
      message: `test(eco-store): #${CU} remove a\n`,
      before: dir => fs.rmSync(path.join(dir, 'libs/eco-store/cart/src/cart.ts')),
    }),
    ['names no task ID']
  );

  // 3. CHANGELOG bullet for feat, fix and perf with code.
  const bullet = `- Added a ([#${CU}](https://app.clickup.com/t/${CU}))`;

  expect(
    'CHANGELOG: feat with code and a staged bullet naming the task passes',
    stageAndCheck({
      files: TOOL_FILE,
      message: `feat(tools): #${CU} add a\n`,
      before: dir => addBullet(dir, bullet),
    }),
    null
  );
  expect(
    'CHANGELOG: feat with code and no bullet fails',
    stageAndCheck({ files: TOOL_FILE, message: `feat(tools): #${CU} add a\n` }),
    [`CHANGELOG.md bullet that names #${CU}`]
  );
  expect(
    'CHANGELOG: a bullet that names another task fails',
    stageAndCheck({
      files: TOOL_FILE,
      message: `fix(tools): #${CU} fix a\n`,
      before: dir =>
        addBullet(dir, `- Fixed a ([#${OTHER_CU}](https://app.clickup.com/t/${OTHER_CU}))`),
    }),
    [`names #${CU}`]
  );
  expect(
    'CHANGELOG: a bullet from an earlier commit of the branch is reused',
    stageAndCheck({
      files: TOOL_FILE,
      message: `fix(tools): #${CU} fix a\n`,
      before: dir => {
        addBullet(dir, bullet);
        commit(dir, { 'tools/b.js': 'b\n' }, `feat(tools): #${CU} add b`);
      },
    }),
    null
  );
  {
    // A second PR of the same task: the branch starts after part one's bullet landed.
    const dir = makeRepo(BRANCH);

    gitOk(dir, ['switch', '-q', 'develop']);
    addBullet(dir, bullet);
    commit(dir, {}, `feat(tools): #${CU} part one`);
    gitOk(dir, ['update-ref', 'refs/remotes/origin/develop', 'HEAD']);
    gitOk(dir, ['switch', '-q', '-C', BRANCH]);
    write(dir, TOOL_FILE);
    gitOk(dir, ['add', '-A']);
    expect(
      'CHANGELOG: a bullet of the task already on develop does not count',
      runCheck(dir, `feat(tools): #${CU} part two\n`),
      [`names #${CU}`]
    );
  }
  {
    // The bullet reaches the branch through a merge of develop, after the branch started.
    const dir = makeRepo(BRANCH);

    commit(dir, { 'tools/w.js': 'w\n' }, `chore(tools): #${CU} start`);
    gitOk(dir, ['switch', '-q', 'develop']);
    addBullet(dir, bullet);
    commit(dir, {}, `feat(tools): #${CU} part one`);
    gitOk(dir, ['update-ref', 'refs/remotes/origin/develop', 'HEAD']);
    gitOk(dir, ['switch', '-q', BRANCH]);
    gitOk(dir, ['merge', '-q', '--no-ff', '--no-edit', 'develop']);
    write(dir, TOOL_FILE);
    gitOk(dir, ['add', '-A']);
    expect(
      'CHANGELOG: nor one that a merge of develop brought in',
      runCheck(dir, `feat(tools): #${CU} part two\n`),
      [`names #${CU}`]
    );
  }
  expect(
    'CHANGELOG: fix with Markdown only needs none',
    stageAndCheck({ files: { 'docs/a.md': 'a\n' }, message: `fix(docs): #${CU} fix a\n` }),
    null
  );
  expect(
    'CHANGELOG: chore with code needs none',
    stageAndCheck({ files: TOOL_FILE, message: `chore(tools): #${CU} add a\n` }),
    null
  );
  for (const header of [
    `perf(tools): #${CU} speed a`,
    `feat(tools)!: #${CU} change a`,
    `feat: #${CU} add a`,
  ]) {
    expect(
      `CHANGELOG: «${header}» needs one`,
      stageAndCheck({ files: TOOL_FILE, message: `${header}\n` }),
      ['CHANGELOG.md bullet']
    );
  }
  expect(
    'CHANGELOG: on a branch with no ClickUp ID any added line passes',
    stageAndCheck({
      branch: 'feat/thing',
      files: TOOL_FILE,
      message: 'feat(tools): add a\n',
      before: dir => addBullet(dir, '- Added a'),
    }),
    null
  );
  expect(
    'CHANGELOG: on a branch with no ClickUp ID no added line fails',
    stageAndCheck({ branch: 'feat/thing', files: TOOL_FILE, message: 'feat(tools): add a\n' }),
    ['this branch adds no line']
  );
  expect(
    'CHANGELOG: with no origin/develop, the local develop is the base',
    stageAndCheck({
      files: TOOL_FILE,
      message: `feat(tools): #${CU} add a\n`,
      before: dir => {
        gitOk(dir, ['update-ref', '-d', 'refs/remotes/origin/develop']);
        addBullet(dir, bullet);
        commit(dir, { 'tools/b.js': 'b\n' }, `feat(tools): #${CU} add b`);
      },
    }),
    null
  );
  expect(
    'CHANGELOG: with no develop at all, the staged bullet is enough',
    stageAndCheck({
      files: TOOL_FILE,
      message: `feat(tools): #${CU} add a\n`,
      before: dir => {
        gitOk(dir, ['update-ref', '-d', 'refs/remotes/origin/develop']);
        gitOk(dir, ['branch', '-q', '-D', 'develop']);
        addBullet(dir, bullet);
      },
    }),
    null
  );

  // Through git commit, with the script as the fixture's commit-msg hook.
  {
    const dir = makeRepo(BRANCH);
    const hook = path.join(dir, '.git', 'hooks', 'commit-msg');

    fs.writeFileSync(hook, `#!/bin/sh\nexec "${process.execPath}" "${SCRIPT}" "$1"\n`, {
      mode: 0o755,
    });
    write(dir, { 'libs/eco-store/cart/src/cart.ts': 'export const cart = 3;\n' });
    expect(
      'git commit -a: the hook sees the files -a stages',
      git(dir, ['commit', '-a', '-m', `feat(eco-store): #${CU} add a`]),
      ['names no task ID', `names #${CU}`]
    );
    addBullet(dir, `- Added a (BOT-04, [#${CU}](https://app.clickup.com/t/${CU}))`);
    expect(
      'git commit <paths>: the hook sees the paths named (the bullet left out)',
      git(dir, [
        'commit',
        '-m',
        `feat(eco-store): #${CU} BOT-04 add a`,
        '--',
        'libs/eco-store/cart/src/cart.ts',
      ]),
      [`names #${CU}`]
    );
    expect(
      'git commit <paths>: and passes with the bullet named too',
      git(dir, [
        'commit',
        '-q',
        '-m',
        `feat(eco-store): #${CU} BOT-04 add a`,
        '--',
        'libs/eco-store/cart/src/cart.ts',
        'CHANGELOG.md',
      ]),
      null
    );
    write(dir, { 'libs/eco-store/cart/src/cart.ts': 'export const cart = 4;\n' });
    gitOk(dir, ['add', '-A']);
    expect(
      'git commit --amend: the bullet the commit already holds counts',
      git(dir, ['commit', '-q', '--amend', '--no-edit']),
      null
    );
  }
} finally {
  for (const dir of repos) fs.rmSync(dir, { recursive: true, force: true });
}

const hook = fs.readFileSync(path.join(ROOT, '.husky/commit-msg'), 'utf8');

if (
  /commitlint --edit[^\n]*\n[\s\S]*node tools\/scripts\/check-commit-refs\.cjs "\$1"/.test(hook)
) {
  passed++;
  console.log('✓ .husky/commit-msg runs the script after commitlint');
} else {
  failures.push(
    '.husky/commit-msg does not run tools/scripts/check-commit-refs.cjs "$1" after commitlint'
  );
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} check(s) failed, ${passed} passed:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`\nAll ${passed} commit-refs checks passed.`);
