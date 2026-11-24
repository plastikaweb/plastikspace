#!/usr/bin/env node
/**
 * META-22: the commit rules commitlint cannot see, run by .husky/commit-msg after it.
 *
 * 1. ClickUp: on a branch named <type>/<clickup-id>-<words>, the header names #<clickup-id>
 *    (commitizen-git-flow, step C). A branch with no ClickUp ID is not checked.
 * 2. Task ID: a commit that stages eco code (apps/eco-store, apps/eco-admin and their -e2e,
 *    libs/eco, libs/eco-store, libs/eco-admin; Markdown does not count, as in the pre-commit)
 *    names in its header a task ID of a family in tools/scripts/task-homes.json (BOT-04,
 *    META-22) or an eco-admin row (AP-0 0.7) (apps/eco-store/CLAUDE.md, «Referencing task
 *    identifiers»).
 * 3. CHANGELOG: a feat, fix or perf commit that stages anything but Markdown needs a
 *    CHANGELOG.md bullet on its branch: a line the branch adds to CHANGELOG.md since it left
 *    develop, this commit's staged lines included, that names the branch's ClickUp ID (any
 *    added line on a branch without one). Later commits of the same branch reuse that bullet.
 *
 * Not checked: merge, revert, fixup!, squash! and amend! messages, and a commit made while a
 * merge, cherry-pick, revert or rebase is in progress (message and changes come from elsewhere).
 *
 * Usage: node tools/scripts/check-commit-refs.cjs <commit-message-file>
 * Test:  yarn commit-refs:test (tools/scripts/test-commit-refs.mjs)
 */
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const { buildGrammar, loadConfig } = require('./sync-eco-store-tasks.cjs');

// The ClickUp ID shapes of sync-eco-store-tasks.cjs (CU_ID_RE): 86 + 7, or 123 + 8, with a letter.
const CLICKUP_ID = '(?:86(?=[a-z0-9]*[a-z])[a-z0-9]{7}|123(?=[a-z0-9]*[a-z])[a-z0-9]{8})';
const BRANCH_CLICKUP_RE = new RegExp(`^[a-z]+/(${CLICKUP_ID})(?:-|$)`);
const ECO_CODE_RE = /^(apps\/eco-(store|admin)(-e2e)?|libs\/eco(-store|-admin)?)\//;
const ECO_ADMIN_ROW_RE = /(?<![A-Za-z0-9_-])AP-\d+(?![A-Za-z0-9_])/;
const IGNORED_RE =
  /^(Merge |Revert "|(fixup|squash|amend)! |Initial commit$|Automatic merge|Auto-merged )/;
const HEADER_TYPE_RE = /^(\w+)(?:\([^)]*\))?!?: /;
const CHANGELOG_TYPES = new Set(['feat', 'fix', 'perf']);
const DEVELOP_REFS = ['origin/develop', 'develop'];

/**
 * Runs git in the current directory.
 * @param {string[]} args The git arguments.
 * @returns {string | null} Its trimmed output, or null when it fails.
 */
function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 26 });

  return result.status === 0 ? result.stdout.replace(/\n$/, '') : null;
}

/**
 * Reads the header of a commit message file as git will record it.
 * @param {string} file The message file git passes to commit-msg.
 * @returns {string} The first line that is neither blank nor a comment.
 */
function readHeader(file) {
  const configured = git(['config', 'core.commentChar']);
  const commentChar = configured && configured !== 'auto' ? configured : '#';
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const scissors = lines.findIndex(
    line => line.startsWith(`${commentChar} -`) && line.includes('>8')
  );
  const kept = (scissors === -1 ? lines : lines.slice(0, scissors)).filter(
    line => !line.startsWith(commentChar)
  );

  return (kept.find(line => line.trim()) ?? '').trim();
}

/**
 * Names the merge, cherry-pick, revert or rebase in progress.
 * @returns {string} Its name, or an empty string when there is none.
 */
function operationInProgress() {
  for (const ref of ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD']) {
    if (git(['rev-parse', '-q', '--verify', ref]) !== null) return ref;
  }
  for (const dir of ['rebase-merge', 'rebase-apply']) {
    const gitPath = git(['rev-parse', '--git-path', dir]);

    if (gitPath && fs.existsSync(gitPath)) return 'rebase';
  }

  return '';
}

/**
 * Finds where the branch left develop.
 * @returns {string | null} The merge base with origin/develop (or develop), or null.
 */
function developBase() {
  for (const ref of DEVELOP_REFS) {
    if (git(['rev-parse', '-q', '--verify', `${ref}^{commit}`]) !== null) {
      const base = git(['merge-base', 'HEAD', ref]);

      if (base) return base;
    }
  }

  return null;
}

/**
 * Lists the CHANGELOG.md lines the branch adds, the staged ones included.
 * @returns {string[]} The added lines, without their leading +.
 */
function changelogLinesAdded() {
  const base =
    developBase() ?? (git(['rev-parse', '-q', '--verify', 'HEAD']) !== null ? 'HEAD' : null);
  const args = ['diff', '--cached', '--no-color', '--unified=0'];
  const diff = git(base ? [...args, base, '--', 'CHANGELOG.md'] : [...args, '--', 'CHANGELOG.md']);

  return (diff ?? '')
    .split('\n')
    .filter(line => line.startsWith('+') && !line.startsWith('+++'))
    .map(line => line.slice(1));
}

/**
 * Checks one commit message against the staged changes.
 * @param {string} messageFile The commit message file.
 * @returns {string[]} One message per broken rule.
 */
function check(messageFile) {
  const header = readHeader(messageFile);

  if (!header || IGNORED_RE.test(header) || operationInProgress()) return [];

  const failures = [];
  const branch = git(['symbolic-ref', '-q', '--short', 'HEAD']) ?? '';
  const clickUpId = branch.match(BRANCH_CLICKUP_RE)?.[1] ?? '';
  const staged = (git(['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMRD']) ?? '')
    .split('\0')
    .filter(Boolean);
  const code = staged.filter(file => !file.endsWith('.md'));
  const type = header.match(HEADER_TYPE_RE)?.[1] ?? '';

  if (clickUpId && !header.includes(`#${clickUpId}`)) {
    failures.push(
      [
        `The header does not name the ClickUp task of branch ${branch}.`,
        `Put #${clickUpId} after the type and scope (commitizen-git-flow, step C):`,
        `  ${header.replace(/: /, `: #${clickUpId} `)}`,
      ].join('\n')
    );
  }

  const ecoCode = code.filter(file => ECO_CODE_RE.test(file));

  if (ecoCode.length) {
    const grammar = buildGrammar(loadConfig().idFamilies);

    if (!new RegExp(grammar.idSource).test(header) && !ECO_ADMIN_ROW_RE.test(header)) {
      failures.push(
        [
          'This commit stages eco code, and its header names no task ID:',
          ...ecoCode.slice(0, 3).map(file => `  ${file}`),
          ...(ecoCode.length > 3 ? [`  … and ${ecoCode.length - 3} more`] : []),
          'Add it after the ClickUp ID, as in «feat(eco-store): #86c9uq646 BOT-04 add …»; an',
          'eco-admin row goes as «AP-0 0.7». `yarn task <ID>` looks one up; the families are the',
          'idFamilies of tools/scripts/task-homes.json (apps/eco-store/CLAUDE.md, «Referencing task',
          'identifiers»). Cross-cutting work goes under META, OPS or TECH.',
        ].join('\n')
      );
    }
  }

  if (CHANGELOG_TYPES.has(type) && code.length) {
    const added = changelogLinesAdded();
    const hasBullet = clickUpId
      ? added.some(line => line.includes(`#${clickUpId}`) || line.includes(`/t/${clickUpId}`))
      : added.some(line => line.trim());

    if (!hasBullet) {
      failures.push(
        [
          clickUpId
            ? `A ${type} commit with code needs a CHANGELOG.md bullet that names #${clickUpId}, and no`
            : `A ${type} commit with code needs a CHANGELOG.md bullet, and this branch adds no line`,
          clickUpId
            ? 'line this branch adds to CHANGELOG.md (this commit included) does.'
            : 'to CHANGELOG.md (this commit included).',
          'Add the bullet under a new entry at the top and stage it with this commit, e.g.',
          clickUpId
            ? `  - Added … (<TASK-ID>, ([#${clickUpId}](https://app.clickup.com/t/${clickUpId})))`
            : '  - Added … (<TASK-ID>, ([#<clickup-id>](https://app.clickup.com/t/<clickup-id>)))',
          'Later commits of the branch reuse it. Nothing a user or a developer would notice? Then it',
          'is not a feat, fix or perf: use refactor, test, chore, build or ci.',
        ].join('\n')
      );
    }
  }

  return failures;
}

if (require.main === module) {
  const messageFile = process.argv[2];

  if (!messageFile) {
    console.error('Usage: node tools/scripts/check-commit-refs.cjs <commit-message-file>');
    process.exit(2);
  }
  const failures = check(messageFile);

  if (failures.length) {
    for (const failure of failures) console.error(`❌ ${failure.replace(/\n/g, '\n   ')}\n`);
    console.error('Commit aborted (tools/scripts/check-commit-refs.cjs, META-22).');
    process.exit(1);
  }
}

module.exports = { check, readHeader };
