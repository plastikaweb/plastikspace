#!/usr/bin/env node
/**
 * META-16 — every library carries a `scope:*` and a `type:*` tag.
 *
 * The `@nx/enforce-module-boundaries` rules in the root eslint.config.mjs are
 * ANDed, and the `type:app` rule lists no scope: a library without both tags
 * cannot be imported by any app. Read-only. Errors, per libs/** project.json:
 *   - missing-scope: no `scope:*` tag (a missing `tags` key counts as none);
 *   - missing-type: no `type:*` tag;
 *   - empty-tag: a tag that is not a non-empty string;
 *   - unknown-scope: a `scope:*` tag that no `sourceTag` of the root
 *     eslint.config.mjs names, so no boundary rule applies to it.
 *
 * The files come from git (tracked plus untracked, ignores applied, deleted
 * files dropped), so CI sees what a local checkout sees. The scopes come from
 * the text of eslint.config.mjs: importing it loads every ESLint plugin and
 * takes about 3 s; `yarn nx-tags:test` checks that both readings agree.
 *
 * Usage:
 *   node tools/scripts/check-nx-tags.cjs [--json] [--root <dir>]
 *
 * Exit codes: 0 clean; 1 one or more errors; 2 usage or IO error.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const ESLINT_CONFIG = 'eslint.config.mjs';
const SOURCE_TAG_RE = /sourceTag:\s*(['"])(scope:[^'"]+)\1/g;

class FatalError extends Error {}

/**
 * Parses the command line.
 * @param {string[]} argv Arguments after the script name.
 * @returns {{ json: boolean, root: string, help: boolean }} The options.
 */
function parseArgs(argv) {
  const opts = { json: false, root: REPO_ROOT, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') opts.json = true;
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--root') {
      const value = argv[++i];
      if (value === undefined || value.startsWith('--'))
        throw new FatalError('--root needs a value');
      opts.root = path.resolve(value);
    } else throw new FatalError(`Unknown argument: ${arg}`);
  }

  return opts;
}

/**
 * Reads the scopes the boundary rules name.
 * @param {string} root Workspace root.
 * @returns {Set<string>} Every `scope:*` used as a `sourceTag`.
 */
function knownScopes(root) {
  const file = path.join(root, ESLINT_CONFIG);
  if (!fs.existsSync(file)) throw new FatalError(`${ESLINT_CONFIG} not found in ${root}`);
  const scopes = new Set(
    [...fs.readFileSync(file, 'utf8').matchAll(SOURCE_TAG_RE)].map(match => match[2])
  );
  if (scopes.size === 0) {
    throw new FatalError(
      `${ESLINT_CONFIG} names no scope:* sourceTag: has the boundary rule moved or changed shape?`
    );
  }

  return scopes;
}

/**
 * Lists the library project files git knows about.
 * @param {string} root Workspace root.
 * @returns {string[]} Paths relative to the root, sorted.
 */
function listLibraries(root) {
  let out;
  try {
    out = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z', '--', 'libs'], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    throw new FatalError(
      `git ls-files failed in ${root}: ${String(error.stderr || error.message).trim()}`
    );
  }

  return out
    .split('\0')
    .filter(file => path.posix.basename(file) === 'project.json')
    .filter(file => fs.existsSync(path.join(root, file)))
    .sort();
}

/**
 * Checks the tags of one library.
 * @param {string} root Workspace root.
 * @param {string} file The project.json path, relative to the root.
 * @param {Set<string>} scopes The scopes the boundary rules name.
 * @returns {{ file: string, check: string, detail: string }[]} Its findings.
 */
function checkLibrary(root, file, scopes) {
  let project;
  try {
    project = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  } catch (error) {
    throw new FatalError(`${file}: ${error.message}`);
  }
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const shown = JSON.stringify(project.tags ?? null);
  const valid = tags.filter(tag => typeof tag === 'string' && tag.trim() !== '');
  const findings = [];
  if (valid.length < tags.length) {
    findings.push({
      file,
      check: 'empty-tag',
      detail: `tags ${shown} hold an empty or non-string tag`,
    });
  }
  const scopeTags = valid.filter(tag => tag.startsWith('scope:'));
  if (scopeTags.length === 0)
    findings.push({ file, check: 'missing-scope', detail: `tags ${shown} have no scope:* tag` });
  if (!valid.some(tag => tag.startsWith('type:'))) {
    findings.push({ file, check: 'missing-type', detail: `tags ${shown} have no type:* tag` });
  }
  for (const tag of scopeTags.filter(scope => !scopes.has(scope))) {
    findings.push({
      file,
      check: 'unknown-scope',
      detail: `${tag} is no sourceTag in ${ESLINT_CONFIG}`,
    });
  }

  return findings;
}

/**
 * Runs the check.
 * @param {string[]} argv Arguments after the script name.
 * @returns {number} The exit code.
 */
function main(argv) {
  let opts;
  try {
    opts = parseArgs(argv);
    if (opts.help) {
      process.stdout.write('Usage: node tools/scripts/check-nx-tags.cjs [--json] [--root <dir>]\n');

      return 0;
    }
    const scopes = knownScopes(opts.root);
    const libraries = listLibraries(opts.root);
    const findings = libraries.flatMap(file => checkLibrary(opts.root, file, scopes));
    if (opts.json) {
      process.stdout.write(
        `${JSON.stringify({ libraries: libraries.length, findings }, null, 2)}\n`
      );
    } else if (findings.length === 0) {
      process.stdout.write(
        `✓ check-nx-tags: ${libraries.length} libraries, each with a scope:* and a type:* tag\n`
      );
    } else {
      for (const { file, check, detail } of findings)
        process.stdout.write(`ERROR ${check} ${file}: ${detail}\n`);
      const failing = new Set(findings.map(({ file }) => file)).size;
      process.stdout.write(
        `✗ check-nx-tags: ${findings.length} error${findings.length === 1 ? '' : 's'} in ${failing} of ${libraries.length} libraries. ` +
          'Every library needs a scope:* tag the root eslint.config.mjs names and a type:* tag (root CLAUDE.md, Library Architecture).\n'
      );
    }

    return findings.length === 0 ? 0 : 1;
  } catch (error) {
    if (!(error instanceof FatalError)) throw error;
    process.stderr.write(`check-nx-tags: ${error.message}\n`);

    return 2;
  }
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { main, knownScopes, SOURCE_TAG_RE };
