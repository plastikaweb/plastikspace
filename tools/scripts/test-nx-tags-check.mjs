#!/usr/bin/env node
/**
 * META-16: tests tools/scripts/check-nx-tags.cjs.
 *
 * - Fixture workspaces in temporary git repos (files left untracked, as the
 *   check lists them with `git ls-files -co`): a clean library, each error
 *   code, apps and gitignored folders left out, the JSON output, and the
 *   fatal cases (exit 2).
 * - The real tree passes.
 * - The scopes read from the text of eslint.config.mjs are the scope:*
 *   sourceTags of the config ESLint imports, so a change of shape in the
 *   boundary rule cannot make the check read the wrong list.
 *
 * Run: yarn nx-tags:test (CI: the Lint Affected step of .github/workflows/ci.yml).
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '../..');
const CHECK = path.join(import.meta.dirname, 'check-nx-tags.cjs');
const CONFIG = [
  'export default [{ rules: { boundaries: ["error", { depConstraints: [',
  "  { sourceTag: '*', onlyDependOnLibsWithTags: ['*'] },",
  "  { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['type:util'] },",
  "  { sourceTag: 'scope:core', onlyDependOnLibsWithTags: ['scope:core'] },",
  '  { sourceTag: "scope:shared", onlyDependOnLibsWithTags: ["scope:shared"] },',
  ']}]}}];',
  '',
].join('\n');

const failures = [];
const temps = [];

/**
 * Builds a fixture workspace in a new git repo.
 * @param {Record<string, unknown>} files Path → content (a string as is, anything else as JSON).
 * @param {string} [config] The eslint.config.mjs text.
 * @returns {string} The workspace root.
 */
function workspace(files, config = CONFIG) {
  const root = mkdtempSync(path.join(tmpdir(), 'nx-tags-'));
  temps.push(root);
  execFileSync('git', ['init', '-q'], { cwd: root });
  const all = { 'eslint.config.mjs': config, ...files };
  for (const [file, content] of Object.entries(all)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    const text = typeof content === 'string' ? content : `${JSON.stringify(content, null, 2)}\n`;
    writeFileSync(path.join(root, file), text);
  }

  return root;
}

/**
 * Runs the check.
 * @param {string[]} args Its arguments.
 * @returns {{ status: number | null, stdout: string, stderr: string }} The result.
 */
function run(args) {
  return spawnSync(process.execPath, [CHECK, ...args], { encoding: 'utf8' });
}

/**
 * Runs the check with --json on a fixture and compares the findings.
 * @param {string} name The case name.
 * @param {Record<string, unknown>} files The fixture files.
 * @param {number} status The expected exit code.
 * @param {string[]} expected The expected findings, as `check file`, sorted.
 * @param {number} libraries The expected library count.
 */
function expectFindings(name, files, status, expected, libraries) {
  const result = run(['--json', '--root', workspace(files)]);
  if (result.status !== status) {
    failures.push(`${name}: exit ${result.status}, expected ${status}. ${result.stderr.trim()}`);

    return;
  }
  const report = JSON.parse(result.stdout);
  const found = report.findings.map(({ check, file }) => `${check} ${file}`).sort();
  if (JSON.stringify(found) !== JSON.stringify(expected)) {
    failures.push(`${name}: found [${found.join(', ')}], expected [${expected.join(', ')}]`);
  } else if (report.libraries !== libraries) {
    failures.push(`${name}: counted ${report.libraries} libraries, expected ${libraries}`);
  } else {
    console.log(`✓ ${name}`);
  }
}

/**
 * Runs the check on a fixture that must stop with exit 2.
 * @param {string} name The case name.
 * @param {string[]} args Arguments before --root, or the whole argument list when root is null.
 * @param {string | null} root The fixture root, or null to pass args alone.
 * @param {RegExp} message What stderr must say.
 */
function expectFatal(name, args, root, message) {
  const result = run(root === null ? args : [...args, '--root', root]);
  if (result.status !== 2 || !message.test(result.stderr)) {
    failures.push(
      `${name}: exit ${result.status}, stderr "${result.stderr.trim()}"; expected exit 2 and ${message}`
    );
  } else {
    console.log(`✓ ${name}`);
  }
}

const lib = tags => ({
  name: 'probe',
  projectType: 'library',
  ...(tags === undefined ? {} : { tags }),
});

try {
  expectFindings(
    'a library with a known scope and a type passes; apps are not libraries',
    {
      'libs/core/a/project.json': lib(['scope:core', 'type:util']),
      'libs/shared/b/project.json': lib(['type:ui', 'scope:shared']),
      'apps/x/project.json': { name: 'x', projectType: 'application', tags: [] },
    },
    0,
    [],
    2
  );
  expectFindings(
    'removing the type:* tag fails (missing-type)',
    { 'libs/core/a/project.json': lib(['scope:core']) },
    1,
    ['missing-type libs/core/a/project.json'],
    1
  );
  expectFindings(
    'no tags key, or an empty list, fails twice (missing-scope, missing-type)',
    { 'libs/core/a/project.json': lib(undefined), 'libs/core/b/project.json': lib([]) },
    1,
    [
      'missing-scope libs/core/a/project.json',
      'missing-scope libs/core/b/project.json',
      'missing-type libs/core/a/project.json',
      'missing-type libs/core/b/project.json',
    ],
    2
  );
  expectFindings(
    'an empty, blank or non-string tag fails (empty-tag)',
    {
      'libs/core/a/project.json': lib(['scope:core', '', 'type:util']),
      'libs/core/b/project.json': lib(['scope:core', ' ', 'type:util']),
      'libs/core/c/project.json': lib(['scope:core', 'type:util', null]),
    },
    1,
    [
      'empty-tag libs/core/a/project.json',
      'empty-tag libs/core/b/project.json',
      'empty-tag libs/core/c/project.json',
    ],
    3
  );
  expectFindings(
    'a scope no sourceTag names fails (unknown-scope)',
    { 'libs/eco/a/project.json': lib(['scope:eco', 'type:util']) },
    1,
    ['unknown-scope libs/eco/a/project.json'],
    1
  );
  expectFindings(
    'a gitignored library is not checked',
    {
      '.gitignore': 'libs/generated/\n',
      'libs/generated/a/project.json': lib([]),
      'libs/core/a/project.json': lib(['scope:core', 'type:util']),
    },
    0,
    [],
    1
  );

  const human = run(['--root', workspace({ 'libs/core/a/project.json': lib(['scope:core']) })]);
  if (
    human.status === 1 &&
    /^ERROR missing-type libs\/core\/a\/project\.json: /m.test(human.stdout)
  ) {
    console.log('✓ the text output names the check and the file');
  } else {
    failures.push(`text output: exit ${human.status}, stdout "${human.stdout.trim()}"`);
  }

  expectFatal(
    'an unknown argument stops with exit 2',
    ['--nope'],
    null,
    /Unknown argument: --nope/
  );
  expectFatal('--root without a value stops with exit 2', ['--root'], null, /--root needs a value/);
  expectFatal(
    'a config with no scope:* sourceTag stops with exit 2',
    [],
    workspace(
      { 'libs/core/a/project.json': lib(['scope:core', 'type:util']) },
      'export default [];\n'
    ),
    /names no scope:\* sourceTag/
  );
  expectFatal(
    'an unreadable project.json stops with exit 2',
    [],
    workspace({ 'libs/core/a/project.json': '{ "tags": [' }),
    /libs\/core\/a\/project\.json: /
  );
  const noGit = mkdtempSync(path.join(tmpdir(), 'nx-tags-nogit-'));
  temps.push(noGit);
  writeFileSync(path.join(noGit, 'eslint.config.mjs'), CONFIG);
  expectFatal('a root outside git stops with exit 2', [], noGit, /git ls-files failed/);

  const real = run([]);
  if (real.status === 0) console.log(`✓ the real tree passes: ${real.stdout.trim()}`);
  else failures.push(`the real tree: exit ${real.status}\n${real.stdout}${real.stderr}`);

  const { knownScopes } = createRequire(import.meta.url)(CHECK);
  const fromText = [...knownScopes(ROOT)].sort();
  const { default: config } = await import(
    pathToFileURL(path.join(ROOT, 'eslint.config.mjs')).href
  );
  const block = config.find(entry => entry.rules?.['@nx/enforce-module-boundaries']);
  const constraints = block?.rules['@nx/enforce-module-boundaries'][1]?.depConstraints ?? [];
  const fromConfig = [...new Set(constraints.map(({ sourceTag }) => sourceTag))]
    .filter(tag => tag.startsWith('scope:'))
    .sort();
  if (fromConfig.length > 0 && JSON.stringify(fromText) === JSON.stringify(fromConfig)) {
    console.log(`✓ the text and the imported config name the same ${fromText.length} scopes`);
  } else {
    failures.push(
      `scopes: text [${fromText.join(', ')}], imported config [${fromConfig.join(', ')}]`
    );
  }
} finally {
  temps.forEach(dir => rmSync(dir, { recursive: true, force: true }));
}

if (failures.length > 0) {
  console.error(`\n✗ check-nx-tags tests: ${failures.length} failed\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log('\n✓ check-nx-tags tests passed');
}
