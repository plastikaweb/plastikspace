#!/usr/bin/env node
/**
 * META-34 — a checkout ready to commit with one command, running its own git hooks.
 *
 * Hooks. Husky sets `core.hooksPath` to `.husky/_`, and its runner there (`h`) runs the
 * `.husky/<hook>` next to itself. That path lives in the config every worktree shares: made
 * absolute, every worktree ran the main checkout's hooks; left relative, a worktree without
 * its own `.husky/_` (gitignored, so none has one) would run no hook at all, silently. This
 * script writes one dispatcher into the shared git directory (`<common dir>/husky-dispatch`)
 * and points `core.hooksPath` at it. Git runs every hook from the top of the checkout that
 * triggers it, so the dispatcher runs that checkout's `.husky/<hook>`, the way husky's runner
 * does (PATH with node_modules/.bin, `sh -e`, HUSKY=0, ~/.config/husky/init.sh). A checkout
 * with no `.husky` folder fails pre-commit, commit-msg and pre-push with a message.
 *
 * Linked worktree only (not the main checkout):
 *   - links the gitignored files a commit needs from the main checkout, when the worktree
 *     has none: apps/eco-store/.env and the PocketBase binary, pb_data and pb_migrations;
 *   - renames the branch with --branch <type>/<words>, and refuses to finish on a
 *     `worktree-*` branch (EnterWorktree's name), which the branch-name lint rejects;
 *   - runs `yarn install --immutable` when node_modules is missing (--no-install skips it).
 *
 * Usage (outside the Bash sandbox: it writes the shared git config and installs packages):
 *   node tools/scripts/worktree-setup.cjs [--branch <type>/<words>] [--no-install] [--hooks-only]
 * Call it with node in a new worktree: Yarn runs no script, `yarn worktree:setup` included,
 * before that checkout is installed.
 * `yarn husky-install` runs it with --hooks-only. Running `npx husky` resets core.hooksPath to
 * `.husky/_`: run this again afterwards. Test: yarn worktree-setup:test.
 *
 * Exit codes: 0 ready; 1 something is left to do (said why); 2 usage or git error.
 */
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Husky 9's hook names (node_modules/husky/index.js).
const HOOKS = [
  'pre-commit',
  'pre-merge-commit',
  'prepare-commit-msg',
  'commit-msg',
  'post-commit',
  'applypatch-msg',
  'pre-applypatch',
  'post-applypatch',
  'pre-rebase',
  'post-rewrite',
  'post-checkout',
  'post-merge',
  'pre-push',
  'pre-auto-gc',
];
const DISPATCH_DIR = 'husky-dispatch';
const LINKS = [
  'apps/eco-store/.env',
  'apps/eco-store/pocketbase/pocketbase',
  'apps/eco-store/pocketbase/pb_data',
  'apps/eco-store/pocketbase/pb_migrations',
];

// The runner every hook name sources. Mirrors node_modules/husky/husky, but finds the hook in
// the checkout git runs it from ($PWD) instead of next to itself.
const RUNNER = `#!/usr/bin/env sh
# Written by tools/scripts/worktree-setup.cjs (META-34); run it again rather than editing this.
# Git runs a hook from the top of the checkout that triggers it, so $PWD/.husky/<hook> is that
# checkout's own hook, whichever worktree it is.
[ "$HUSKY" = "2" ] && set -x
n=$(basename "$0")
s="$PWD/.husky/$n"

if [ ! -d "$PWD/.husky" ]; then
  case "$n" in
    pre-commit | commit-msg | pre-push | pre-merge-commit | prepare-commit-msg)
      echo "❌ $PWD has no .husky folder, so git cannot run its $n hook."
      echo "   Check out a branch that has one (develop does) before committing or pushing."
      exit 1
      ;;
  esac
  exit 0
fi
[ ! -f "$s" ] && exit 0

i="\${XDG_CONFIG_HOME:-$HOME/.config}/husky/init.sh"
[ -f "$i" ] && . "$i"

[ "\${HUSKY-}" = "0" ] && exit 0

export PATH="node_modules/.bin:$PATH"
sh -e "$s" "$@"
c=$?

[ $c != 0 ] && echo "husky - $n script failed (code $c)"
[ $c = 127 ] && echo "husky - command not found in PATH=$PATH"
exit $c
`;
const WRAPPER = '#!/usr/bin/env sh\n. "$(dirname "$0")/h"\n';

/**
 * Runs git in the current directory.
 * @param {string[]} args The git arguments.
 * @returns {{ ok: boolean, out: string }} Whether it succeeded, and its trimmed output.
 */
function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' });

  return {
    ok: result.status === 0,
    out: `${result.stdout ?? ''}`.trim() || `${result.stderr ?? ''}`.trim(),
  };
}

/**
 * Reads the value of an option.
 * @param {string[]} argv The arguments.
 * @param {string} name The option, with its dashes.
 * @returns {string | undefined} Its value.
 */
function option(argv, name) {
  const at = argv.indexOf(name);

  return at === -1 ? undefined : argv[at + 1];
}

/**
 * Checks a branch name against the separator and prefixes of branchNameLint.json, which
 * `yarn branch:lint` applies on every commit. Its banned and disallowed names (wip, develop)
 * have no separator, so they fail the first check.
 * @param {string} top The checkout's top folder.
 * @param {string} name The branch name.
 * @returns {string} Why it is refused, or an empty string.
 */
function branchProblem(top, name) {
  const config = JSON.parse(
    fs.readFileSync(path.join(top, 'branchNameLint.json'), 'utf8')
  ).branchNameLinter;
  const [prefix, ...rest] = name.split(config.separator);

  if (!rest.join('')) return `it needs a type and a name: <type>${config.separator}<words>`;
  if (!config.prefixes.includes(prefix))
    return `"${prefix}" is not one of ${config.prefixes.join(', ')}`;

  return '';
}

/**
 * Writes the dispatcher and points core.hooksPath at it.
 * @param {string} commonDir The absolute shared git directory.
 * @returns {string} The dispatcher folder.
 */
function installDispatcher(commonDir) {
  const dir = path.join(commonDir, DISPATCH_DIR);

  fs.mkdirSync(dir, { recursive: true });
  for (const [name, content] of [['h', RUNNER], ...HOOKS.map(hook => [hook, WRAPPER])]) {
    fs.writeFileSync(path.join(dir, name), content);
    fs.chmodSync(path.join(dir, name), 0o755);
  }
  const before = git(['config', '--get', 'core.hooksPath']).out;
  const set = git(['config', 'core.hooksPath', dir]);

  if (!set.ok) throw new Error(`git config core.hooksPath failed: ${set.out}`);
  console.log(
    before === dir
      ? `✓ Hooks: core.hooksPath already ${dir}`
      : `✓ Hooks: core.hooksPath ${before || '(unset)'} → ${dir}`
  );

  return dir;
}

/**
 * Links the gitignored files a commit needs from the main checkout.
 * @param {string} top The worktree's top folder.
 * @param {string} main The main checkout's top folder.
 */
function linkFromMain(top, main) {
  for (const file of LINKS) {
    const source = path.join(main, file);
    const target = path.join(top, file);
    let existing = null;

    try {
      existing = fs.lstatSync(target);
    } catch {
      existing = null;
    }
    if (existing) {
      console.log(
        `✓ Kept ${file}${existing.isSymbolicLink() ? ` (→ ${fs.readlinkSync(target)})` : ''}`
      );
    } else if (!fs.existsSync(source)) {
      console.log(`ℹ️  ${file} is not in the main checkout either: not linked`);
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.symlinkSync(source, target);
      console.log(`✓ Linked ${file} → ${source}`);
    }
  }
}

/**
 * Runs the setup.
 * @param {string[]} argv The arguments after the script name.
 * @returns {number} The exit code.
 */
function main(argv) {
  const flags = new Set(['--no-install', '--hooks-only']);
  const branchAt = argv.indexOf('--branch');
  const stray = argv.filter(
    (arg, i) => !flags.has(arg) && (branchAt === -1 || (i !== branchAt && i !== branchAt + 1))
  );

  if (stray.length || (branchAt !== -1 && !option(argv, '--branch')?.match(/^[^-]/))) {
    console.error(
      'Usage: node tools/scripts/worktree-setup.cjs [--branch <type>/<words>] [--no-install] [--hooks-only]'
    );

    return 2;
  }
  // Absolute paths: run from a subfolder, git prints some of them relative to it.
  const paths = git([
    'rev-parse',
    '--path-format=absolute',
    '--show-toplevel',
    '--git-dir',
    '--git-common-dir',
  ]);

  if (!paths.ok) {
    console.error(`❌ Not inside a git checkout with a working tree: ${paths.out}`);

    return 2;
  }
  const [top, gitDir, commonDir] = paths.out.split('\n');
  const linked = fs.realpathSync(gitDir) !== fs.realpathSync(commonDir);
  // The first entry of `git worktree list` is the main checkout.
  const mainTop = git(['worktree', 'list', '--porcelain'])
    .out.split('\n')[0]
    .replace(/^worktree /, '');
  const todo = [];

  try {
    installDispatcher(commonDir);
  } catch (error) {
    console.error(`❌ ${error.message}`);

    return 2;
  }
  if (!fs.existsSync(path.join(top, '.husky'))) {
    todo.push(
      'this checkout has no .husky folder: its commits and pushes will fail until it has one'
    );
  }

  if (linked && !argv.includes('--hooks-only')) {
    linkFromMain(top, mainTop);

    const wanted = option(argv, '--branch');
    const current = git(['symbolic-ref', '-q', '--short', 'HEAD']).out;

    if (wanted) {
      const problem = branchProblem(top, wanted);

      if (problem) {
        console.error(`❌ Branch ${wanted}: ${problem}`);

        return 1;
      }
      if (wanted !== current) {
        const renamed = git(['branch', '-m', wanted]);

        if (!renamed.ok) {
          console.error(`❌ git branch -m ${wanted} failed: ${renamed.out}`);

          return 1;
        }
        console.log(`✓ Branch ${current} → ${wanted}`);
      }
    } else if (current.startsWith('worktree-')) {
      todo.push(
        `branch ${current} fails the branch-name lint: run again with --branch <type>/<task-id>-<words>`
      );
    }

    if (fs.existsSync(path.join(top, 'node_modules'))) {
      console.log('✓ Kept node_modules');
    } else if (argv.includes('--no-install')) {
      todo.push(
        'node_modules is missing: run yarn install (the hooks need lint-staged, ESLint and Prettier)'
      );
    } else {
      console.log('… node_modules is missing: yarn install --immutable');
      const install = spawnSync('yarn', ['install', '--immutable'], { cwd: top, stdio: 'inherit' });

      if (install.status !== 0) todo.push('yarn install failed (above)');
    }
  }

  if (todo.length) {
    for (const item of todo) console.error(`❌ ${item}`);

    return 1;
  }
  console.log(`\n${top} is ready: its commits and pushes run its own .husky hooks.`);

  return 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { main, RUNNER, HOOKS, DISPATCH_DIR };
