/**
 * META-12 — what `.husky/pre-commit` checks: the staged files only, one process
 * per tool whatever the number of projects they belong to. lint-staged hides the
 * unstaged hunks of partially staged files while these commands run, and stages
 * what the fixers change.
 *
 * CI keeps `nx affected --target=lint`, which also sees files that are not staged
 * (an orphan import in an unstaged file only shows up there).
 */
import path from 'node:path';

const ESLINT_FILES = /^(apps|libs)\/.+\.(ts|html)$/;
const MARKDOWN_FILES = /\.md$/;

const quote = files => files.map(file => `"${file}"`).join(' ');

export default {
  '*': stagedFiles => {
    const files = stagedFiles.map(file => path.relative(process.cwd(), file));
    const eslintFiles = files.filter(file => ESLINT_FILES.test(file));
    const markdownFiles = files.filter(file => MARKDOWN_FILES.test(file));
    const commands = [];

    if (eslintFiles.length > 0) commands.push(`eslint --fix ${quote(eslintFiles)}`);
    // --no-globs: without it the `globs` of .markdownlint-cli2.yaml (**/*.md) are
    // appended and all ~200 docs get linted again. Its `ignores` still apply.
    if (markdownFiles.length > 0)
      commands.push(`markdownlint-cli2 --no-globs ${quote(markdownFiles)}`);
    commands.push(`prettier --write --ignore-unknown ${quote(files)}`);

    return commands;
  },
};
