#!/usr/bin/env node
/**
 * META-14 — Claude Code hook: Claude checks its own changes before it ends a turn.
 *
 * SessionStart: records the files already modified in the checkout, with their content hash, so
 * that work in progress from before the session is never checked as if Claude had written it.
 *
 * Stop: takes the files that differ from HEAD (untracked ones included) and whose content is not
 * the one recorded at session start, and runs on them what the git hooks and CI would run:
 *   - ESLint, fast profile (no ESLINT_TYPED, META-13), errors only, on the files lint-staged lints;
 *   - markdownlint on the Markdown files, and `prettier --check` on every file;
 *   - new lines in those ESLint files that silence a check instead of fixing it (`eslint-disable`,
 *     `@ts-ignore` and its kin, `prettier-ignore`, `.skip` or `.only` in a test): each one is
 *     reported once, so keeping it is a decision Claude states, not a quiet way out;
 *   - `vitest related` in each project with changed TypeScript, for at most MAX_TEST_PROJECTS
 *     projects (an HTML template counts as the component next to it);
 *   - `yarn tasks:check` when a task doc of tools/scripts/task-homes.json changed.
 * A failure exits 2 with the findings on stderr: Claude Code keeps the turn open and hands them to
 * Claude. A failure blocks once: when it is still there at the next stop (`stop_hook_active`), the
 * hook lets the turn end, tells the user, and leaves those files alone until their content changes.
 * Each check remembers the content hash of the files it passed or already reported, so a turn
 * without new changes costs two git calls.
 *
 * `$CLAUDE_PROJECT_DIR` is the checkout the session started in, so its copy of this script runs;
 * the checks run in the checkout of the hook's `cwd` (a worktree, once Claude works there), with
 * that checkout's node_modules and configs. State lives in that checkout's git dir
 * (`git rev-parse --git-path claude-stop-check`), one file per session.
 *
 * Test by hand, from a checkout with changes:
 *   echo '{"hook_event_name":"Stop","session_id":"manual","cwd":"'"$PWD"'"}' | node .claude/hooks/stop-check.mjs; echo $?
 */
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const MAX_FILES = 60;
const MAX_TEST_PROJECTS = 2;
const MAX_SECTION_CHARS = 4000;
const STATE_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
const VITE_CONFIGS = ['vite.config.mts', 'vite.config.ts', 'vite.config.mjs', 'vite.config.js'];
const CHECKS = ['lint', 'tests', 'tasks'];
const MEMOS = ['passed', 'shown'];

const gitSync = (cwd, args, stdin) => {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    input: stdin,
    maxBuffer: 256 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error(`git ${args[0]}: ${(result.stderr ?? '').trim()}`);

  return result.stdout;
};

/** Runs a command without a shell; resolves with its exit status and both streams. */
const exec = (command, args, cwd, timeoutMs) =>
  new Promise(resolve => {
    const env = { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' };
    delete env.ESLINT_TYPED;
    const child = spawn(command, args, { cwd, env });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => (stdout += chunk));
    child.stderr.on('data', chunk => (stderr += chunk));
    const timer = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    child.on('error', error => {
      clearTimeout(timer);
      resolve({ status: -1, stdout, stderr: `${stderr}${error.message}` });
    });
    child.on('close', (status, signal) => {
      clearTimeout(timer);
      const killed = signal ? `\n(stopped after ${timeoutMs / 1000} s)` : '';
      resolve({ status: signal ? -1 : status, stdout, stderr: `${stderr}${killed}` });
    });
  });

const clipHead = text =>
  text.length <= MAX_SECTION_CHARS ? text : `${text.slice(0, MAX_SECTION_CHARS)}\n…`;
const clipTail = text =>
  text.length <= MAX_SECTION_CHARS ? text : `…\n${text.slice(-MAX_SECTION_CHARS)}`;
const sha1 = text => createHash('sha1').update(text).digest('hex');

/** Files that differ from HEAD and exist on disk (untracked ones too), with their blob hash. */
const currentFiles = root => {
  const entries = gitSync(root, ['status', '--porcelain=v1', '-z', '--untracked-files=all']).split(
    '\0'
  );
  const files = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.length < 4) continue;
    // A rename or copy is followed by its original path, which is not a file of its own.
    if (entry[0] === 'R' || entry[0] === 'C') i++;
    const file = entry.slice(3);
    const stat = fs.statSync(path.join(root, file), { throwIfNoEntry: false });
    if (!file.includes('\n') && stat?.isFile()) files.push(file);
  }
  if (files.length === 0) return new Map();
  const hashes = gitSync(root, ['hash-object', '--stdin-paths'], `${files.join('\n')}\n`)
    .trim()
    .split('\n');

  return new Map(files.map((file, index) => [file, hashes[index]]));
};

const readState = file => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

const writeState = (file, state) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(state));
};

const pruneStates = dir => {
  for (const name of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    const file = path.join(dir, name);
    if (Date.now() - fs.statSync(file).mtimeMs > STATE_MAX_AGE_MS) fs.rmSync(file, { force: true });
  }
};

/** The ESLint and Markdown patterns of lint-staged.config.mjs, the pre-commit's own list. */
const loadPatterns = async root => {
  const file = path.join(root, 'lint-staged.config.mjs');
  if (!fs.existsSync(file)) return null;
  const config = await import(pathToFileURL(file).href);

  return config.ESLINT_FILES instanceof RegExp && config.MARKDOWN_FILES instanceof RegExp
    ? { eslint: config.ESLINT_FILES, markdown: config.MARKDOWN_FILES }
    : null;
};

const loadTaskDocs = root => {
  try {
    const { homes } = JSON.parse(
      fs.readFileSync(path.join(root, 'tools/scripts/task-homes.json'), 'utf8')
    );

    return new Set(
      homes.flatMap(home => [home.tasks, ...(home.companions ?? []), ...(home.specs ?? [])])
    );
  } catch {
    return new Set();
  }
};

/** The nearest project.json above a file, below the root project, and whether it has Vitest. */
const findProject = (root, file) => {
  for (let dir = path.dirname(file); dir !== '.' && dir !== ''; dir = path.dirname(dir)) {
    const projectFile = path.join(root, dir, 'project.json');
    if (!fs.existsSync(projectFile)) continue;
    const { name } = JSON.parse(fs.readFileSync(projectFile, 'utf8'));
    const hasVitest = VITE_CONFIGS.some(config => fs.existsSync(path.join(root, dir, config)));

    return { dir, name: name ?? dir, hasVitest };
  }

  return null;
};

// A comment or call that silences a check instead of fixing what it found.
const SUPPRESSION =
  /eslint-disable|@ts-(?:ignore|nocheck|expect-error)|prettier-ignore|\b(?:it|test|describe)\.(?:skip|only)\(|\bx(?:it|describe)\(/;

/** Added lines that silence a check: lines added since HEAD, or any line of an untracked file. */
const findSuppressions = (root, files, known) => {
  const found = [];
  // With no paths, `git ls-files --` and `git diff HEAD --` would read the whole repo.
  if (files.length === 0) return found;
  const add = (file, line, text) => {
    if (SUPPRESSION.test(text) && !(known[file] ?? []).includes(text.trim()))
      found.push({ file, line, text: text.trim() });
  };
  const tracked = new Set(
    gitSync(root, ['ls-files', '--', ...files])
      .split('\n')
      .filter(Boolean)
  );
  for (const file of files.filter(file => !tracked.has(file)))
    fs.readFileSync(path.join(root, file), 'utf8')
      .split('\n')
      .forEach((text, index) => add(file, index + 1, text));
  if (tracked.size === 0) return found;
  const diff = gitSync(root, [
    'diff',
    '--no-color',
    '--no-ext-diff',
    '-U0',
    'HEAD',
    '--',
    ...tracked,
  ]);
  let file = null;
  let line = 0;
  for (const text of diff.split('\n')) {
    if (text.startsWith('+++ ')) file = text.startsWith('+++ b/') ? text.slice(6) : null;
    else if (text.startsWith('@@')) line = Number(/\+(\d+)/.exec(text)?.[1] ?? 0);
    else if (text.startsWith('+') && file) add(file, line++, text.slice(1));
  }

  return found;
};

/** The file whose tests cover a change: the file itself, or the component of an HTML template. */
const testSource = (root, file) => {
  if (/\.(ts|mts|cts)$/.test(file) && !file.endsWith('.d.ts')) return file;
  const component = file.replace(/\.html$/, '.ts');
  if (component !== file && fs.existsSync(path.join(root, component))) return component;

  return null;
};

const runEslint = async (root, bin, files) => {
  const { status, stdout, stderr } = await exec(
    bin('eslint'),
    ['--quiet', '--no-warn-ignored', '--format', 'json', ...files],
    root,
    180_000
  );
  if (status === 0) return null;
  let results;
  try {
    results = JSON.parse(stdout);
  } catch {
    return { title: 'ESLint did not run', text: clipTail(stderr || stdout), failing: files };
  }
  const lines = results.flatMap(result =>
    result.messages.map(
      message =>
        `${path.relative(root, result.filePath)}:${message.line ?? 0}:${message.column ?? 0}  ${message.ruleId ?? 'parse error'}  ${message.message}`
    )
  );
  const failing = results
    .filter(result => result.messages.length > 0)
    .map(result => path.relative(root, result.filePath));
  if (lines.length === 0) return { title: 'ESLint failed', text: clipTail(stderr), failing: files };

  return { title: 'ESLint (fast profile, errors only)', text: clipHead(lines.join('\n')), failing };
};

const runMarkdownlint = async (root, bin, files) => {
  const { status, stdout, stderr } = await exec(
    bin('markdownlint-cli2'),
    ['--no-globs', ...files],
    root,
    60_000
  );
  if (status === 0) return null;
  const lines = `${stdout}\n${stderr}`
    .split('\n')
    .filter(line => files.some(file => line.startsWith(`${file}:`)));
  const failing = files.filter(file => lines.some(line => line.startsWith(`${file}:`)));

  return {
    title: 'markdownlint',
    text: clipHead(lines.join('\n') || stderr || stdout),
    failing: failing.length > 0 ? failing : files,
  };
};

const runPrettier = async (root, bin, files) => {
  const { status, stdout, stderr } = await exec(
    bin('prettier'),
    ['--check', '--ignore-unknown', ...files],
    root,
    60_000
  );
  if (status === 0) return null;
  const lines = `${stdout}\n${stderr}`.split('\n');
  const failing = files.filter(file =>
    lines.some(line => line === `[warn] ${file}` || line.startsWith(`[error] ${file}:`))
  );
  const errors = lines.filter(line => line.startsWith('[error]'));

  return {
    title: 'Prettier: not formatted (`yarn prettier --write <file>` fixes it)',
    text: clipHead(
      [...failing.filter(file => !errors.some(line => line.includes(file))), ...errors].join('\n')
    ),
    failing: failing.length > 0 ? failing : files,
  };
};

const runTests = async (root, bin, project, files, sources) => {
  const { status, stdout, stderr } = await exec(
    bin('vitest'),
    [
      'related',
      '--run',
      '--passWithNoTests',
      '--coverage.enabled=false',
      ...sources.map(source => path.relative(project.dir, source)),
    ],
    path.join(root, project.dir),
    300_000
  );
  if (status === 0) return null;

  return {
    title: `Tests: vitest related in ${project.name} (${project.dir})`,
    text: clipTail(`${stdout}\n${stderr}`.trim()),
    failing: files,
  };
};

const main = async () => {
  const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  const event = input.hook_event_name;
  if (event !== 'SessionStart' && event !== 'Stop') return { code: 0 };

  let root;
  try {
    root = gitSync(input.cwd || process.cwd(), ['rev-parse', '--show-toplevel']).trim();
  } catch {
    return { code: 0 };
  }
  const packageFile = path.join(root, 'package.json');
  if (!fs.existsSync(packageFile)) return { code: 0 };
  const packageJson = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  if (packageJson.name !== 'plastikspace') return { code: 0 };

  const stateDir = path.resolve(
    root,
    gitSync(root, ['rev-parse', '--git-path', 'claude-stop-check']).trim()
  );
  const stateFile = path.join(stateDir, `${String(input.session_id).replace(/[^\w-]/g, '_')}.json`);
  const files = currentFiles(root);
  const saved = readState(stateFile);

  if (event === 'SessionStart') {
    // A resumed or compacted session keeps the baseline of its start.
    if (!saved) writeState(stateFile, { baseline: Object.fromEntries(files) });
    pruneStates(stateDir);

    return { code: 0 };
  }

  // No baseline: the session started in another checkout (this is a worktree Claude moved to)
  // or before this hook existed. Every changed file counts as the session's own.
  const state = saved ?? { baseline: {} };
  state.knownSuppressions ??= {};
  const changed = [...files.keys()].filter(file => state.baseline[file] !== files.get(file));
  // passed: the content passed the check. shown: it failed, Claude saw the findings and the turn
  // ended anyway. Either way it is not checked again until it changes.
  for (const memo of MEMOS) {
    state[memo] ??= {};
    for (const check of CHECKS) {
      const known = state[memo][check] ?? {};
      state[memo][check] = Object.fromEntries(
        changed.filter(file => known[file] === files.get(file)).map(file => [file, known[file]])
      );
    }
  }
  const pending = check =>
    changed.filter(file => MEMOS.every(memo => state[memo][check][file] !== files.get(file)));
  const markPassed = (check, passedFiles) => {
    for (const file of passedFiles) state.passed[check][file] = files.get(file);
  };
  const notes = [];
  const sections = [];
  // A message for the user, once per distinct text in a session.
  const tell = message => {
    if (!message || state.told === sha1(message)) return undefined;
    state.told = sha1(message);

    return message;
  };

  const bin = name => path.join(root, 'node_modules', '.bin', name);
  if (changed.length > 0 && !fs.existsSync(bin('eslint'))) {
    const message = tell(`stop-check skipped: ${root} has no node_modules (yarn install).`);
    writeState(stateFile, state);

    return { code: 0, message };
  }

  // Lint and format: ESLint, markdownlint and Prettier, per file.
  const lintFiles = pending('lint');
  const lintJob = (async () => {
    if (lintFiles.length === 0) return [];
    if (lintFiles.length > MAX_FILES) {
      notes.push(
        `${lintFiles.length} changed files, more than ${MAX_FILES}: ESLint, markdownlint and Prettier skipped (run \`yarn affected:lint\` and \`yarn format:check\`).`
      );

      return [];
    }
    const patterns = await loadPatterns(root);
    if (!patterns)
      notes.push(
        'lint-staged.config.mjs here exports no ESLINT_FILES (the branch predates META-14): ESLint and markdownlint skipped.'
      );
    const eslintFiles = patterns ? lintFiles.filter(file => patterns.eslint.test(file)) : [];
    const markdownFiles = patterns ? lintFiles.filter(file => patterns.markdown.test(file)) : [];
    const results = (
      await Promise.all([
        eslintFiles.length > 0 ? runEslint(root, bin, eslintFiles) : null,
        markdownFiles.length > 0 ? runMarkdownlint(root, bin, markdownFiles) : null,
        runPrettier(root, bin, lintFiles),
      ])
    ).filter(Boolean);
    const suppressions = findSuppressions(root, eslintFiles, state.knownSuppressions);
    if (suppressions.length > 0)
      results.push({
        title: 'New suppressions: a check silenced instead of fixed',
        text: clipHead(
          suppressions.map(found => `${found.file}:${found.line}  ${found.text}`).join('\n')
        ),
        failing: [...new Set(suppressions.map(found => found.file))],
        suppressions,
      });
    const failing = new Set(results.flatMap(result => result.failing));
    markPassed(
      'lint',
      lintFiles.filter(file => !failing.has(file))
    );

    return results.map(result => ({ ...result, check: 'lint' }));
  })();

  // Tests: vitest related, per project.
  const testFiles = pending('tests');
  const testsJob = (async () => {
    const byProject = new Map();
    for (const file of testFiles) {
      const source = testSource(root, file);
      const project = source ? findProject(root, source) : null;
      if (!project?.hasVitest) {
        markPassed('tests', [file]);
        continue;
      }
      const entry = byProject.get(project.dir) ?? { project, files: [], sources: new Set() };
      entry.files.push(file);
      entry.sources.add(source);
      byProject.set(project.dir, entry);
    }
    if (byProject.size === 0) return [];
    if (byProject.size > MAX_TEST_PROJECTS) {
      const names = [...byProject.values()].map(entry => entry.project.name);
      notes.push(
        `Changes in ${names.length} projects with tests, more than ${MAX_TEST_PROJECTS}: tests skipped (run \`yarn nx run-many -t test -p ${names.join(',')}\`).`
      );

      return [];
    }
    const results = await Promise.all(
      [...byProject.values()].map(async ({ project, files: projectFiles, sources }) => {
        const result = await runTests(root, bin, project, projectFiles, [...sources]);
        if (!result) markPassed('tests', projectFiles);

        return result;
      })
    );

    return results.filter(Boolean).map(result => ({ ...result, check: 'tests' }));
  })();

  // Task docs: yarn tasks:check, as the package.json script runs it.
  const taskDocs = loadTaskDocs(root);
  const taskFiles = pending('tasks');
  const tasksJob = (async () => {
    markPassed(
      'tasks',
      taskFiles.filter(file => !taskDocs.has(file))
    );
    const docs = taskFiles.filter(file => taskDocs.has(file));
    const script = packageJson.scripts?.['tasks:check'];
    if (docs.length === 0 || !script) return [];
    const { status, stdout, stderr } = await exec('sh', ['-c', script], root, 120_000);
    if (status === 0) {
      markPassed('tasks', docs);

      return [];
    }

    return [
      {
        check: 'tasks',
        title: 'yarn tasks:check',
        text: clipTail(`${stdout}\n${stderr}`.trim()),
        failing: docs,
      },
    ];
  })();

  sections.push(...(await lintJob), ...(await testsJob), ...(await tasksJob));
  const noteText = notes.map(note => `- ${note}`).join('\n');

  if (sections.length === 0) {
    const message = tell(notes.length > 0 ? `stop-check:\n${noteText}` : undefined);
    writeState(stateFile, state);

    return { code: 0, message };
  }

  // A suppression is reported once, to Claude or to the user: after that it is a known decision.
  for (const found of sections.flatMap(section => section.suppressions ?? []))
    (state.knownSuppressions[found.file] ??= []).push(found.text);

  if (input.stop_hook_active) {
    for (const section of sections) {
      const check = section.check;
      for (const file of section.failing) state.shown[check][file] = files.get(file);
    }
    const failing = [...new Set(sections.flatMap(section => section.failing))];
    const message = `stop-check: still failing after one try, left to you: ${sections.map(section => section.title.replace(/[:(].*$/, '').trim()).join(', ')} in ${failing.join(', ')}.`;
    writeState(stateFile, state);

    return { code: 0, message: clipHead(message) };
  }
  writeState(stateFile, state);
  const report = sections.map(section => `## ${section.title}\n\n${section.text}`).join('\n\n');

  return {
    code: 2,
    stderr: [
      'stop-check (META-14): the files changed in this session fail the checks that the git hooks and CI run. Fix the cause before ending the turn; do not silence it (eslint-disable, @ts-ignore, .skip). If something must stay, tell the user why.',
      report,
      notes.length > 0 ? `Not checked:\n${noteText}` : '',
    ]
      .filter(Boolean)
      .join('\n\n'),
  };
};

main()
  .then(({ code, message, stderr }) => {
    // Exit 2 with the reason on stderr blocks the stop; it needs no JSON on stdout to be parsed.
    if (message) process.stdout.write(`${JSON.stringify({ systemMessage: message })}\n`);
    if (stderr) process.stderr.write(`${stderr}\n`);
    process.exitCode = code;
  })
  .catch(error => {
    process.stderr.write(`stop-check crashed: ${error.stack ?? error}\n`);
    process.exitCode = 1;
  });
