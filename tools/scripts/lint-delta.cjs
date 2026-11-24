#!/usr/bin/env node
/**
 * META-18 — ESLint warnings may not grow on the files a branch touches.
 *
 * Warnings never fail `nx lint`, so they pile up. This compares, file by
 * file, the warnings of the version on disk with those of the same file at
 * the base, and fails when any touched file has more than before. Existing
 * warnings in a file never block a change to it; new ones do.
 *
 * - Touched files: `git diff --diff-filter=ACMR -M <base>` (committed and
 *   uncommitted changes against the base, renames followed) plus untracked
 *   files. A file new since the base counts 0 warnings there; a renamed one
 *   is compared with its old path.
 * - Base: `git merge-base HEAD origin/develop`, or `--base <ref>` (a stacked
 *   branch passes its parent).
 * - Both versions go through `ESLint.lintText` with the same `filePath`, so
 *   the same config, processors and inline templates apply: a config change
 *   alone never counts as growth. Files ESLint ignores or has no config for
 *   are left out. The fast profile always: ESLINT_TYPED is removed before
 *   ESLint loads its config, so CI and hooks count the same warnings.
 * - `--scope-only` classifies the touched files (ts, html, scss, i18n, docs,
 *   other) without running ESLint; the task-audit skill (META-23) uses it.
 *
 * Usage:
 *   node tools/scripts/lint-delta.cjs [--base <ref>] [--scope-only] [--json] [--root <dir>]
 *
 * Exit codes: 0 no file gained warnings; 1 one or more did; 2 usage, git or ESLint error.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_UPSTREAM = 'origin/develop';
const PARTITIONS = [
  ['ts', /\.(ts|tsx|mts|cts)$/],
  ['html', /\.html$/],
  ['scss', /\.(scss|css)$/],
  ['i18n', /(^|\/)i18n\/[^/]+\.json$/],
  ['docs', /\.md$/],
];

class FatalError extends Error {}

/**
 * Parses the command line.
 * @param {string[]} argv Arguments after the script name.
 * @returns {{ base: string | null, scopeOnly: boolean, json: boolean, root: string, help: boolean }} The options.
 */
function parseArgs(argv) {
  const opts = { base: null, scopeOnly: false, json: false, root: REPO_ROOT, help: false };
  const value = (arg, index) => {
    const next = argv[index];
    if (next === undefined || next.startsWith('--')) throw new FatalError(`${arg} needs a value`);

    return next;
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--base') opts.base = value(arg, ++i);
    else if (arg === '--root') opts.root = path.resolve(value(arg, ++i));
    else if (arg === '--scope-only') opts.scopeOnly = true;
    else if (arg === '--json') opts.json = true;
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else throw new FatalError(`Unknown argument: ${arg}`);
  }

  return opts;
}

/**
 * Runs git in the workspace.
 * @param {string} root Workspace root.
 * @param {string[]} args Git arguments.
 * @returns {string} Its stdout.
 */
function git(root, args) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    throw new FatalError(
      `git ${args.join(' ')} failed: ${String(error.stderr || error.message).trim()}`
    );
  }
}

/**
 * Resolves the base commit.
 * @param {string} root Workspace root.
 * @param {string | null} base The --base value, if any.
 * @returns {string} The base commit's full hash.
 */
function resolveBase(root, base) {
  if (base !== null)
    return git(root, ['rev-parse', '--verify', '--quiet', `${base}^{commit}`]).trim();
  try {
    return git(root, ['merge-base', 'HEAD', DEFAULT_UPSTREAM]).trim();
  } catch (error) {
    throw new FatalError(
      `no merge base with ${DEFAULT_UPSTREAM} (${error.message}); pass --base <ref>`
    );
  }
}

/**
 * Lists the touched files, each with its path at the base.
 * @param {string} root Workspace root.
 * @param {string} base The base commit.
 * @returns {{ file: string, basePath: string | null }[]} Sorted by path; basePath is null for a new file.
 */
function touchedFiles(root, base) {
  const touched = new Map();
  const fields = git(root, ['diff', '--name-status', '-z', '-M', '--diff-filter=ACMR', base]).split(
    '\0'
  );
  for (let i = 0; i < fields.length - 1; ) {
    const status = fields[i];
    if (status.startsWith('R')) {
      touched.set(fields[i + 2], fields[i + 1]);
      i += 3;
    } else {
      touched.set(fields[i + 1], status === 'A' ? null : fields[i + 1]);
      i += 2;
    }
  }
  for (const file of git(root, ['ls-files', '--others', '--exclude-standard', '-z']).split('\0')) {
    if (file && !touched.has(file)) touched.set(file, null);
  }

  return [...touched]
    .filter(([file]) => fs.existsSync(path.join(root, file)))
    .map(([file, basePath]) => ({ file, basePath }))
    .sort((a, b) => a.file.localeCompare(b.file));
}

/**
 * Groups files by kind.
 * @param {string[]} files Touched files.
 * @returns {Record<string, string[]>} Kind → files.
 */
function partition(files) {
  const groups = Object.fromEntries(
    [...PARTITIONS.map(([name]) => name), 'other'].map(name => [name, []])
  );
  for (const file of files)
    groups[PARTITIONS.find(([, re]) => re.test(file))?.[0] ?? 'other'].push(file);

  return groups;
}

/**
 * Lints one text and returns its warnings.
 * @param {import('eslint').ESLint} eslint The ESLint instance.
 * @param {string} text The source.
 * @param {string} filePath Absolute path that picks the config.
 * @returns {Promise<{ ruleId: string, line: number, message: string }[]>} Its warnings.
 */
async function warningsOf(eslint, text, filePath) {
  const results = await eslint.lintText(text, { filePath, warnIgnored: false });

  return results.flatMap(result =>
    result.messages
      .filter(msg => msg.severity === 1)
      .map(msg => ({ ruleId: msg.ruleId ?? 'eslint', line: msg.line, message: msg.message }))
  );
}

/**
 * Counts warnings by a key.
 * @param {{ ruleId: string, message: string }[]} warnings Warnings.
 * @param {(warning: { ruleId: string, message: string }) => string} key What to count by.
 * @returns {Map<string, number>} Key → count.
 */
function countBy(warnings, key) {
  const counts = new Map();
  for (const warning of warnings) counts.set(key(warning), (counts.get(key(warning)) ?? 0) + 1);

  return counts;
}

const byRule = warning => warning.ruleId;
const byMessage = warning => `${warning.ruleId}\u0000${warning.message}`;

/**
 * Compares the warnings of each touched file at the base and on disk.
 * @param {string} root Workspace root.
 * @param {string} base The base commit.
 * @param {{ file: string, basePath: string | null }[]} touched Touched files.
 * @returns {Promise<{ file: string, basePath: string | null, base: number, head: number, grown: { ruleId: string, base: number, head: number, warnings: { line: number, message: string }[] }[] }[]>} One entry per linted file.
 */
async function compare(root, base, touched) {
  delete process.env.ESLINT_TYPED;
  const { ESLint } = require('eslint');
  const eslint = new ESLint({ cwd: root });
  const results = [];
  for (const { file, basePath } of touched) {
    const absolute = path.join(root, file);
    if (await eslint.isPathIgnored(absolute)) continue;
    const head = await warningsOf(eslint, fs.readFileSync(absolute, 'utf8'), absolute);
    const before =
      basePath === null
        ? []
        : await warningsOf(eslint, git(root, ['show', `${base}:${basePath}`]), absolute);
    const headRules = countBy(head, byRule);
    const baseRules = countBy(before, byRule);
    const headMessages = countBy(head, byMessage);
    const baseMessages = countBy(before, byMessage);
    // Lines move, so a warning is matched by its text: the listed ones are those whose text
    // shows up more often than at the base (every line of that text, since which is new is unknown).
    const grownText = warning =>
      headMessages.get(byMessage(warning)) > (baseMessages.get(byMessage(warning)) ?? 0);
    const grown = [...headRules]
      .filter(([ruleId, count]) => count > (baseRules.get(ruleId) ?? 0))
      .map(([ruleId, count]) => ({
        ruleId,
        base: baseRules.get(ruleId) ?? 0,
        head: count,
        warnings: head
          .filter(warning => warning.ruleId === ruleId && grownText(warning))
          .map(({ line, message }) => ({ line, message })),
      }));
    results.push({ file, basePath, base: before.length, head: head.length, grown });
  }

  return results;
}

/**
 * Prints the human report.
 * @param {string} base The base commit.
 * @param {ReturnType<typeof compare> extends Promise<infer R> ? R : never} results The comparison.
 * @param {number} touched How many files were touched.
 */
function report(base, results, touched) {
  const failing = results.filter(result => result.head > result.base);
  for (const { file, basePath, base: before, head, grown } of failing) {
    const from = basePath && basePath !== file ? ` (was ${basePath})` : '';
    process.stdout.write(`ERROR ${file}${from}: ${before} → ${head} warnings\n`);
    for (const rule of grown) {
      process.stdout.write(`  ${rule.ruleId}: ${rule.base} → ${rule.head}\n`);
      for (const { line, message } of rule.warnings)
        process.stdout.write(`    ${line}: ${message}\n`);
    }
  }
  const total = side => results.reduce((sum, result) => sum + result[side], 0);
  const summary =
    `lint-delta: ${touched} touched files since ${base.slice(0, 8)}, ${results.length} linted; ` +
    `warnings ${total('base')} → ${total('head')}`;
  if (failing.length === 0) process.stdout.write(`✓ ${summary}; no file gained warnings\n`);
  else {
    process.stdout.write(
      `✗ ${summary}; ${failing.length} file${failing.length === 1 ? '' : 's'} gained warnings. ` +
        'Fix the new warnings above (the rules listed grew in that file); existing ones may stay.\n'
    );
  }
}

/**
 * Runs the check.
 * @param {string[]} argv Arguments after the script name.
 * @returns {Promise<number>} The exit code.
 */
async function main(argv) {
  try {
    const opts = parseArgs(argv);
    if (opts.help) {
      process.stdout.write(
        'Usage: node tools/scripts/lint-delta.cjs [--base <ref>] [--scope-only] [--json] [--root <dir>]\n'
      );

      return 0;
    }
    const base = resolveBase(opts.root, opts.base);
    const touched = touchedFiles(opts.root, base);
    const files = touched.map(({ file }) => file);
    if (opts.scopeOnly) {
      const groups = partition(files);
      if (opts.json)
        process.stdout.write(`${JSON.stringify({ base, files, partition: groups }, null, 2)}\n`);
      else {
        process.stdout.write(`base: ${base}\ntouched files: ${files.length}\n`);
        for (const [name, list] of Object.entries(groups)) {
          if (list.length > 0)
            process.stdout.write(
              `[${name}] ${list.length}\n${list.map(file => `  ${file}\n`).join('')}`
            );
        }
      }

      return 0;
    }
    let results;
    try {
      results = await compare(opts.root, base, touched);
    } catch (error) {
      if (error instanceof FatalError) throw error;
      throw new FatalError(`ESLint failed: ${error.message}`);
    }
    const failing = results.filter(result => result.head > result.base);
    if (opts.json) process.stdout.write(`${JSON.stringify({ base, files, results }, null, 2)}\n`);
    else report(base, results, files.length);

    return failing.length === 0 ? 0 : 1;
  } catch (error) {
    if (!(error instanceof FatalError)) throw error;
    process.stderr.write(`lint-delta: ${error.message}\n`);

    return 2;
  }
}

if (require.main === module) main(process.argv.slice(2)).then(code => (process.exitCode = code));

module.exports = { main, partition };
