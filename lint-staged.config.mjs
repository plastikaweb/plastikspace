/**
 * META-12 — what `.husky/pre-commit` checks: the staged files only, one process per
 * tool whatever the number of projects they belong to (lint-staged splits a list of
 * more than about a thousand files into chunks and runs them in parallel). lint-staged
 * hides the unstaged hunks of partially staged files while these commands run, and
 * stages what the fixers change.
 *
 * CI keeps `nx affected --target=lint`, which also sees files that are not staged
 * (an orphan import in an unstaged file only shows up there), and runs the rules that
 * need type information, which the hooks skip (ESLINT_TYPED=1, META-13).
 */
import path from 'node:path';

// apps/eco-store/scripts is left out as the former root .eslintignore left it out: ESLint 10
// lints a file with its nearest config, and that folder has one, for its own lint target.
const ESLINT_FILES = /^(apps|libs)\/(?!eco-store\/scripts\/).+\.(ts|html)$/;
const MARKDOWN_FILES = /\.md$/;

// lint-staged splits each command with string-argv, which knows quotes but no
// escapes: a path with a double quote (the tracked .agent/skills/"playwright"/ folder)
// goes in single quotes.
const quote = files =>
  files
    .map(file => {
      if (!file.includes('"')) return `"${file}"`;
      if (!file.includes("'")) return `'${file}'`;
      throw new Error(
        `lint-staged.config.mjs cannot quote a path with both kinds of quotes: ${file}`
      );
    })
    .join(' ');

export default {
  '*': stagedFiles => {
    const files = stagedFiles.map(file => path.relative(process.cwd(), file));
    const eslintFiles = files.filter(file => ESLINT_FILES.test(file));
    const markdownFiles = files.filter(file => MARKDOWN_FILES.test(file));
    const commands = [];

    // Problem and layout fixes only. The suggestion fixes write JSDoc stubs:
    // jsdoc/require-jsdoc an empty block, which then fails jsdoc/match-description (the
    // commit stops on a comment the fixer wrote), and jsdoc/require-param a bare
    // `@param name` line, while CI (no --fix) only warns about the missing JSDoc. The
    // price: an error whose fix is a suggestion (prefer-const) stops the commit and is
    // fixed by hand, as before META-12.
    if (eslintFiles.length > 0)
      commands.push(`eslint --fix --fix-type problem,layout ${quote(eslintFiles)}`);
    // --no-globs: without it the `globs` of .markdownlint-cli2.yaml (**/*.md) are
    // appended and all ~200 docs get linted again. Its `ignores` still apply.
    if (markdownFiles.length > 0)
      commands.push(`markdownlint-cli2 --no-globs ${quote(markdownFiles)}`);
    commands.push(`prettier --write --ignore-unknown ${quote(files)}`);

    return commands;
  },
};
