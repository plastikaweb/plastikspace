#!/usr/bin/env node
/**
 * META-32: .claude/hooks/guard.sh, the PreToolUse guard of Claude Code, and its commit half,
 * .claude/hooks/commit-msg-check.mjs. Each case feeds the guard one tool call as JSON and reads
 * its decision: block (exit 2), ask (a permissionDecision "ask" on stdout) or allow.
 *
 * - Hook bypasses: --no-verify, -n, HUSKY=0 and core.hooksPath stay blocked; flags named only in
 *   a quoted message or a heredoc do not.
 * - Pipes: git commit and git push into another command are blocked; a redirect, ||, and other
 *   git commands into a pipe are not.
 * - Commit messages: -F from $TMPDIR or a relative path is blocked; messages commitlint rejects
 *   are blocked from a -F file, a heredoc that writes it, `-F -`, -m literals and -m heredocs.
 * - PocketBase: stopping, starting or copying it asks, eco-store:pocketbase:stop included; text
 *   that only names it (a grep pattern) does not.
 *
 * Run: yarn guard:test (CI: the Lint Affected step of .github/workflows/ci.yml).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
// GUARD_UNDER_TEST points the cases at another copy, such as develop's, to see them fail there.
const GUARD = process.env.GUARD_UNDER_TEST ?? path.join(ROOT, '.claude/hooks/guard.sh');

const failures = [];
let passed = 0;

/**
 * Runs the guard on one tool call.
 * @param {string} tool The tool name.
 * @param {Record<string, string>} toolInput The tool input.
 * @returns {{ decision: string, output: string }} The decision and what the guard printed.
 */
function runGuard(tool, toolInput) {
  const result = spawnSync('bash', [GUARD], {
    input: JSON.stringify({ tool_name: tool, tool_input: toolInput }),
    encoding: 'utf8',
  });
  let decision = 'allow';
  if (result.status === 2) decision = 'block';
  else if (result.status !== 0) decision = `exit ${result.status}`;
  else if (result.stdout.includes('"ask"')) decision = 'ask';

  return { decision, output: `${result.stdout}${result.stderr}`.trim() };
}

/**
 * Checks the guard's decision on a Bash command.
 * @param {string} expected The expected decision.
 * @param {string} name The case name.
 * @param {string} command The command.
 */
function expectBash(expected, name, command) {
  const { decision, output } = runGuard('Bash', { command });
  if (decision === expected) {
    passed++;
    const reason = output.match(/\[guard\] (?:blocked: )?([^"\n]{0,60})/)?.[1];
    console.log(`✓ ${expected.padEnd(5)} ${name}${reason ? `  (${reason}…)` : ''}`);
  } else {
    failures.push(
      `${name}: expected ${expected}, got ${decision}${output ? `\n    ${output}` : ''}`
    );
  }
}

/**
 * Checks the guard's decision on a file edit.
 * @param {string} expected The expected decision.
 * @param {string} filePath The edited file.
 */
function expectEdit(expected, filePath) {
  const { decision } = runGuard('Edit', { file_path: filePath });
  if (decision === expected) {
    passed++;
    console.log(`✓ ${expected.padEnd(5)} Edit ${path.basename(filePath)}`);
  } else {
    failures.push(`Edit ${filePath}: expected ${expected}, got ${decision}`);
  }
}

fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
const fixture = fs.mkdtempSync(path.join(ROOT, 'tmp', 'guard-'));
const goodFile = path.join(fixture, 'good.txt');
const badFile = path.join(fixture, 'bad.txt');
const unwritten = path.join(fixture, 'written-by-the-command.txt');
fs.writeFileSync(
  goodFile,
  'chore(workspace): #123kjkdr15p META-32 check the guard\n\nA short body.\n'
);
fs.writeFileSync(badFile, 'Chore: Check The Guard\n');

const GOOD = 'chore(workspace): #123kjkdr15p META-32 check the guard';
const LONG_HEADER = `chore(workspace): #123kjkdr15p META-32 ${'x'.repeat(70)}`;
const LONG_FOOTER_LINE = `Refs #1234 ${'word '.repeat(25)}`;

try {
  // Hook bypasses.
  expectBash('block', 'commit --no-verify', `git commit --no-verify -m "${GOOD}"`);
  expectBash('block', 'commit -nm', `git commit -nm "${GOOD}"`);
  expectBash('block', 'HUSKY=0 push', 'HUSKY=0 git push origin develop');
  expectBash(
    'block',
    'core.hooksPath override',
    `git -c core.hooksPath=/dev/null commit -m "${GOOD}"`
  );
  expectBash(
    'allow',
    '--no-verify named in a quoted message',
    `git commit -m "docs(workspace): #123kjkdr15p META-32 name the --no-verify flag"`
  );
  expectBash(
    'allow',
    '--no-verify named in a heredoc body',
    `git commit -m "$(cat <<'EOF'\n${GOOD}\n\nNever pass --no-verify or HUSKY=0.\nEOF\n)"`
  );

  // Pipes.
  expectBash('block', 'push piped into tail', 'git push -u origin feat/x 2>&1 | tail -5');
  expectBash('block', 'commit piped into tail', `git commit -q -F ${goodFile} 2>&1 | tail -5`);
  expectBash(
    'block',
    'push behind caffeinate piped into tee',
    'caffeinate -i git push origin feat/x | tee push.log'
  );
  expectBash('block', 'push piped inside a subshell', '(git push origin feat/x | tail -3)');
  expectBash(
    'allow',
    'push piped, exit code from PIPESTATUS',
    'git push origin feat/x 2>&1 | tail -5; echo "exit ${PIPESTATUS[0]}"'
  );
  expectBash(
    'allow',
    'commit piped under pipefail',
    `set -o pipefail; git commit -F ${goodFile} | tail -3`
  );
  expectBash(
    'allow',
    'push redirected to a file',
    'git push origin feat/x > push.log 2>&1; echo "exit $?"'
  );
  expectBash('allow', 'push || echo', 'git push origin feat/x || echo failed');
  expectBash('allow', 'log piped into head', 'git log --oneline -5 | head -3');
  expectBash('allow', 'grep for a git push in scripts', `grep -rn 'git push' tools | head`);

  // Commit message files.
  expectBash('block', '-F from $TMPDIR', 'git commit -F "$TMPDIR/msg.txt"');
  expectBash('block', '-F from a relative path', 'git commit -F msg.txt');
  expectBash('allow', '-F from an absolute file commitlint accepts', `git commit -F ${goodFile}`);
  expectBash('block', '-F from an absolute file commitlint rejects', `git commit -F ${badFile}`);
  expectBash(
    'block',
    '-F of a file the command writes, rejected',
    `cat > ${unwritten} <<'EOF'\nChore: Check The Guard\nEOF\ngit commit -F ${unwritten}`
  );
  expectBash(
    'allow',
    '-F of a file the command writes, accepted',
    `cat > "${unwritten}" <<'EOF'\n${GOOD}\nEOF\ngit commit -F "${unwritten}"`
  );
  expectBash('block', '-F - with a long header', `git commit -F - <<'EOF'\n${LONG_HEADER}\nEOF`);

  // Commit message flags.
  expectBash('allow', '-m literal commitlint accepts', `git commit -m "${GOOD}"`);
  expectBash('block', '-m header over 100', `git commit -m "${LONG_HEADER}"`);
  expectBash(
    'block',
    '-m with a wrong type',
    `git commit -m 'update(workspace): #123kjkdr15p META-32 check'`
  );
  expectBash(
    'block',
    '-m heredoc with a footer line over 100',
    `git commit -m "$(cat <<'EOF'\n${GOOD}\n\n${LONG_FOOTER_LINE}\nEOF\n)"`
  );
  expectBash('allow', '-m from a variable (not linted)', 'git commit -m "$msg"');
  expectBash('allow', 'amend without a message', 'git commit --amend --no-edit');

  // PocketBase.
  expectBash('ask', 'pocketbase:stop script', 'yarn eco-store:pocketbase:stop');
  expectBash('ask', 'pkill of the serve process', `pkill -f 'pocketbase serve'`);
  expectBash('ask', 'kill by port through xargs', 'lsof -ti:8090 | xargs kill');
  expectBash(
    'ask',
    'serve started from its folder',
    'cd apps/eco-store/pocketbase && ./pocketbase serve'
  );
  expectBash('ask', 'eco-store:local', 'yarn eco-store:local');
  expectBash(
    'ask',
    'copy of pb_data',
    'cp -R apps/eco-store/pocketbase/pb_data /private/tmp/pb-copy'
  );
  expectBash(
    'ask',
    'pb_data named in a loop list, removed in its body',
    'for f in .env pb_data; do [ -L "$P/$f" ] && rm "$P/$f"; done'
  );
  expectBash('ask', 'pkill in a loop body', 'for i in 1 2; do pkill -f pocketbase; done');
  expectBash('ask', 'pkill inside bash -c', `bash -c 'pkill -f pocketbase'`);
  expectBash('allow', 'grep for rm and pb_data', `grep -rn 'rm -rf' tools | grep pb_data`);
  expectBash(
    'allow',
    'grep for pkill and pocketbase',
    `grep -n 'pkill -f' package.json | grep pocketbase`
  );
  expectBash('allow', 'grep for the local script name', `grep -rn "eco-store:local" documentation`);
  expectBash('allow', 'rg for kill and the port', `rg 'kill -9' tools | grep 8090`);
  expectBash('allow', 'listing pb_data', 'ls apps/eco-store/pocketbase/pb_data');

  // Edits.
  expectEdit('block', path.join(ROOT, 'apps/eco-store/pocketbase/pb_schema.json'));
  expectEdit('block', path.join(ROOT, 'yarn.lock'));
  expectEdit('allow', path.join(ROOT, 'package.json'));
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(`\n✗ ${failures.length} failed, ${passed} passed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`\n${passed} of ${passed} guard checks pass.`);
