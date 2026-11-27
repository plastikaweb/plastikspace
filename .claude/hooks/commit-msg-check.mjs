#!/usr/bin/env node
/**
 * META-32: the commit half of guard.sh. It reads a Bash command that runs `git commit` on stdin
 * and blocks it (reason on stderr, exit 2) before the pre-commit hook spends minutes on it:
 *
 * - `-F <file>` with a relative path or a `$TMPDIR` path. `$TMPDIR` is a different folder in
 *   the sandboxed and the unsandboxed shell, so a message written in one is missing in the other
 *   and the commit dies after the whole pre-commit has passed.
 * - A message commitlint rejects (`commitlint.config.cjs`: header 100, body 500, footer lines
 *   100, type and subject rules). The `commit-msg` hook runs it only after the pre-commit.
 *
 * The message is read where the command states it: an existing `-F` file, a heredoc that writes
 * that file or feeds `-F -`, and `-m` values, quoted literals or `"$(cat <<'EOF' … EOF)"`. Any
 * other form (a variable, a command substitution, the editor) is not linted: exit 0.
 *
 * Test: yarn guard:test.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');

/**
 * Blocks the command.
 * @param {string} reason Why, and what to do instead.
 */
function block(reason) {
  process.stderr.write(`[guard] blocked: ${reason}\n`);
  process.exit(2);
}

/**
 * Removes one level of shell quotes from a word.
 * @param {string} word The word as written.
 * @returns {string} Its value.
 */
function unquote(word) {
  if (word.startsWith("'") && word.endsWith("'")) return word.slice(1, -1);
  if (word.startsWith('"') && word.endsWith('"'))
    return word.slice(1, -1).replace(/\\(["\\$`])/g, '$1');

  return word;
}

/**
 * Finds the body of the heredoc that a pattern opens.
 * @param {string} text The command.
 * @param {string} opener A regex source that ends right before `<<`.
 * @returns {string | undefined} The body, without its delimiter line.
 */
function heredocAfter(text, opener) {
  const match = new RegExp(
    `${opener}<<-?\\s*(['"]?)(\\w+)\\1[^\\n]*\\n([\\s\\S]*?)\\n[ \\t]*\\2[ \\t]*(?:\\n|$)`
  ).exec(text);

  return match?.[3];
}

/**
 * Escapes a string for use inside a regex.
 * @param {string} text The literal text.
 * @returns {string} The escaped text.
 */
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const command = fs.readFileSync(0, 'utf8');
const start = /(?:^|[\s;&|(])git\b[^\n;&|]*?\scommit(?=\s|$)/.exec(command);
if (!start) process.exit(0);

// The commit's own arguments: up to the next command separator outside quotes and heredocs is
// more than a regex can tell, so everything after `commit` is searched for its flags.
const args = command.slice(start.index + start[0].length);
const WORD = String.raw`("(?:[^"\\]|\\.)*"|'[^']*'|[^\s;&|]+)`;

let message;
let isUnknown = false;

const fileFlag = new RegExp(String.raw`(?:^|\s)(?:-[A-Za-z]*F\s*|--file(?:=|\s+))` + WORD).exec(
  args
);
if (fileFlag) {
  const written = fileFlag[1];
  const file = unquote(written);
  if (file === '-') {
    message = heredocAfter(args, String.raw`[\s\S]*?`);
    isUnknown = message === undefined;
  } else if (/^\$\{?TMPDIR\b/.test(file)) {
    block(
      `git commit -F ${written}: $TMPDIR is another folder in the unsandboxed shell, where commits run, so the message can be missing after the whole pre-commit. Write it to an absolute path under /private/tmp and pass that path.`
    );
  } else if (!/^[/~$]/.test(file)) {
    block(
      `git commit -F ${written} is a relative path, read from wherever the shell's working directory is by then. Pass an absolute path.`
    );
  } else if (file.startsWith('/') && fs.existsSync(file)) {
    message = fs.readFileSync(file, 'utf8');
  } else {
    // Written by the same command, as `cat > <file> <<'EOF'`: lint that heredoc.
    const target = `["']?${escapeRegex(written.replace(/^["']|["']$/g, ''))}["']?`;
    message = heredocAfter(command, String.raw`>\s*${target}\s*`);
    isUnknown = message === undefined;
  }
} else {
  const parts = [];
  const flag = new RegExp(String.raw`(?:^|\s)(?:-[A-Za-z]*m\s*|--message(?:=|\s+))` + WORD, 'g');
  for (const match of args.matchAll(flag)) {
    const written = match[1];
    if (/^"\$\(\s*cat\s*<</.test(written) || written === '"$(cat') {
      const body = heredocAfter(args.slice(match.index), String.raw`\$\(\s*cat\s*`);
      if (body === undefined) isUnknown = true;
      else parts.push(body);
    } else if (written.startsWith("'") || (written.startsWith('"') && !/[$`]/.test(written))) {
      parts.push(unquote(written));
    } else {
      isUnknown = true;
    }
  }
  if (parts.length > 0) message = parts.join('\n\n');
}

if (isUnknown || message === undefined) process.exit(0);

const commitlint = path.join(ROOT, 'node_modules/.bin/commitlint');
if (!fs.existsSync(commitlint)) process.exit(0);

const result = spawnSync(commitlint, [], { cwd: ROOT, input: message, encoding: 'utf8' });
if (result.status !== 0 && result.status !== null) {
  const problems = `${result.stdout}${result.stderr}`
    .split('\n')
    .filter(line => line.startsWith('✖') && !/found \d+ problems/.test(line))
    .map(line => `  ${line}`)
    .join('\n');
  block(
    `commitlint rejects this message, and the commit-msg hook would only say so after the whole pre-commit:\n${problems}\nHeader ≤100, body ≤500 and every body line ≤100 (lines with #refs parse as footer).`
  );
}

process.exit(0);
