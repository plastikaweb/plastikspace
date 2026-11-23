#!/usr/bin/env node
/**
 * META-13: checks the two profiles of the ESLint configs.
 *
 * - Typed profile (ESLINT_TYPED=1, what CI lints with), on the fixture
 *   tools/scripts/fixtures/eslint-profiles/typed-rules.ts: the rules that need type information
 *   are exactly the three the fixture covers, and they report each `expect:` comment of the
 *   fixture (line, rule, severity) and nothing else.
 * - Fast profile (hooks, editors, local runs): ESLint lints the fixture without throwing (a rule
 *   that needs types throws there, "requires type information", instead of reporting) and reports
 *   none of those findings. No project config may bring one back into the hooks, which two checks
 *   cover: every block of every tracked ESLint config (eslint.config.js, .mjs, .cjs, .ts, .mts or
 *   .cts), whatever files it targets, turns on no rule that needs types and sets no parser option
 *   that asks for a TypeScript program; and in every folder with such a config, the config ESLint
 *   computes for a virtual .ts, .mts, .cts, .tsx and .spec.ts file has neither.
 * - The private-fields rule (META-29), in the fast profile: on a virtual file under libs/ it
 *   reports the line of a `private` field and nothing else, not a `#` field or a `private` method.
 *   A selector that matches no node fails silently otherwise, as `ClassProperty` did.
 * - On CI (CI=true), ESLINT_TYPED must be 1, since the same step then lints the projects.
 *
 * Rules are told apart by their metadata (`requiresTypeChecking`). A rule that only uses type
 * information when it gets some, such as cypress/unsafe-to-chain-command, is out of its reach.
 *
 * Each profile runs in a process of its own: ESLint imports eslint.config.mjs once per process,
 * so the environment the process starts with fixes the profile.
 *
 * Run: yarn lint:profiles (CI: the Lint Affected step of .github/workflows/ci.yml).
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '../..');
const FIXTURE = path.join(import.meta.dirname, 'fixtures/eslint-profiles/typed-rules.ts');
const TYPED_RULES = [
  '@typescript-eslint/naming-convention',
  '@typescript-eslint/no-deprecated',
  '@typescript-eslint/prefer-readonly',
].sort();
const PROBE_EXTENSIONS = ['ts', 'mts', 'cts', 'tsx', 'spec.ts'];
// Every name ESLint looks up for a flat config, as does @nx/eslint/plugin to infer a lint target.
const CONFIG_NAMES = ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts'].map(
  extension => `*eslint.config.${extension}`
);
const MARKER = '@@eslint-profile@@';
// META-29: the private-fields rule must report line 2 of this file, and only that line.
const PRIVATE_FIELDS_PROBE = {
  file: 'libs/eslint-profile-probe/src/private-fields.ts',
  code: [
    'export class Probe {',
    '  private hidden = 1;',
    '  #kept = 2;',
    '  private sum(): number {',
    '    return this.hidden + this.#kept;',
    '  }',
    '}',
    '',
  ].join('\n'),
  lines: [2],
};
const SEVERITIES = { 1: 'warn', 2: 'error' };

/**
 * Lists the rules on in `config` whose metadata says they need type information.
 * naming-convention needs it only through a selector with `types`, so it counts only with one.
 * @param {import('eslint').Linter.Config} config The config ESLint computed for a file.
 * @returns {string[]} The rule ids, sorted.
 */
function rulesNeedingTypes(config) {
  return Object.entries(config.rules ?? {})
    .filter(([id, entry]) => {
      const [severity, ...options] = Array.isArray(entry) ? entry : [entry];
      if (severity === 0 || severity === 'off') return false;
      const slash = id.lastIndexOf('/');
      const [plugin, name] = slash === -1 ? ['@', id] : [id.slice(0, slash), id.slice(slash + 1)];
      const rule = config.plugins?.[plugin]?.rules?.[name];
      if (!rule?.meta?.docs?.requiresTypeChecking) return false;

      return id !== '@typescript-eslint/naming-convention' || options.some(option => option?.types);
    })
    .map(([id]) => id)
    .sort();
}

/**
 * Whether `config` asks the parser for a TypeScript program.
 * @param {import('eslint').Linter.Config} config The config ESLint computed for a file.
 * @returns {boolean} True with a non-empty `project` or any `projectService`.
 */
function asksForProgram(config) {
  const { project, projectService } = config.languageOptions?.parserOptions ?? {};

  return (
    (Array.isArray(project) ? project.length > 0 : Boolean(project)) || Boolean(projectService)
  );
}

/**
 * Lists the tracked ESLint configs, the root one first.
 * @returns {string[]} Their paths, relative to ROOT.
 */
function listConfigFiles() {
  const files = execFileSync('git', ['ls-files', '-z', '--', ...CONFIG_NAMES], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean);

  return [
    ...files.filter(file => !file.includes('/')),
    ...files.filter(file => file.includes('/')),
  ];
}

/**
 * Fast profile only: reads every block of every config, whatever files it targets, for a program
 * or a rule that needs types. A block shared by several configs (the root's, spread into each
 * project's) is read once, under the first config that has it.
 * @param {string[]} configFiles The configs, relative to ROOT, the root one first.
 * @returns {Promise<{blocks: number, offenders: string[]}>} What it read and what failed.
 */
async function scanBlocks(configFiles) {
  const seen = new Set();
  const offenders = [];
  for (const file of configFiles) {
    const exported = await import(pathToFileURL(path.join(ROOT, file)).href).then(
      module => module.default,
      error => {
        throw new Error(`${file} does not load: ${error?.message ?? error}`);
      }
    );
    const blocks = [await exported].flat(Infinity);
    const plugins = Object.assign({}, ...blocks.map(block => block?.plugins ?? {}));
    blocks.forEach((block, index) => {
      if (!block || seen.has(block)) return;
      seen.add(block);
      // A later block that gives naming-convention only a severity keeps these options, so a
      // `types` selector counts even where this block turns the rule off.
      const naming = [block.rules?.['@typescript-eslint/naming-convention']].flat().slice(1);
      const found = new Set([
        ...(asksForProgram(block) ? ['a TypeScript program'] : []),
        ...rulesNeedingTypes({ rules: block.rules, plugins }),
        ...(naming.some(option => option?.types) ? ['@typescript-eslint/naming-convention'] : []),
      ]);
      if (found.size > 0) {
        const files = JSON.stringify(block.files ?? 'every file');
        offenders.push(`${file}, block ${index + 1} (files ${files}): ${[...found].join(', ')}`);
      }
    });
  }

  return { blocks: seen.size, offenders };
}

/**
 * Fast profile only: probes a virtual file of each extension in every folder with an ESLint
 * config, with the ignores real runs apply, for a program or a rule that needs types.
 * @param {typeof import('eslint').ESLint} ESLint The ESLint class.
 * @param {string[]} configFiles The configs, relative to ROOT.
 * @returns {Promise<{probed: number, offenders: string[]}>} What it probed and what failed.
 */
async function sweepConfigs(ESLint, configFiles) {
  const eslint = new ESLint({ cwd: ROOT });
  const folders = [...new Set(configFiles.map(file => path.dirname(file)))];
  const offenders = [];
  let probed = 0;
  for (const folder of folders) {
    for (const extension of PROBE_EXTENSIONS) {
      const file = path.join(ROOT, folder, `__eslint_profile_probe__.${extension}`);
      const config = await eslint.calculateConfigForFile(file);
      if (!config) continue;
      probed++;
      const rules = rulesNeedingTypes(config);
      if (rules.length > 0 || asksForProgram(config)) {
        const program = asksForProgram(config) ? ['a TypeScript program'] : [];
        offenders.push(`${path.relative(ROOT, file)}: ${[...program, ...rules].join(', ')}`);
      }
    }
  }

  return { probed, offenders };
}

/**
 * Child process: lints the fixture with the profile its environment selects (and, in the fast
 * profile, checks every config), then prints the result after MARKER.
 * @returns {Promise<void>}
 */
async function lintFixture() {
  const { ESLint } = await import('eslint');
  // The root config ignores every folder beside apps/ and libs/. `ignore: false` lifts that; the
  // config is still the one ESLint finds for the fixture, the root eslint.config.mjs.
  const eslint = new ESLint({ cwd: ROOT, ignore: false });
  const isFast = process.env.ESLINT_TYPED !== '1';
  let result;
  try {
    const config = await eslint.calculateConfigForFile(FIXTURE);
    const [report] = await eslint.lintFiles([FIXTURE]);
    const configFiles = isFast ? listConfigFiles() : [];
    result = {
      rulesNeedingTypes: rulesNeedingTypes(config),
      asksForProgram: asksForProgram(config),
      messages: report.messages.map(({ ruleId, line, severity, fatal, message }) => ({
        ruleId,
        line,
        severity,
        fatal: Boolean(fatal),
        message,
      })),
      scan: isFast ? await scanBlocks(configFiles) : null,
      sweep: isFast ? await sweepConfigs(ESLint, configFiles) : null,
      privateFields: isFast ? await probePrivateFields(eslint) : null,
    };
  } catch (error) {
    result = { thrown: String(error?.message ?? error) };
  }
  // After a marker: @nx/enforce-module-boundaries prints a warning on stdout when no cached
  // project graph exists.
  process.stdout.write(`\n${MARKER}${JSON.stringify(result)}\n`);
}

/**
 * Lints PRIVATE_FIELDS_PROBE as a virtual file and returns the lines the private-fields rule
 * reports on it.
 * @param {import('eslint').ESLint} eslint The worker's ESLint instance.
 * @returns {Promise<number[]>} The reported lines.
 */
async function probePrivateFields(eslint) {
  const [report] = await eslint.lintText(PRIVATE_FIELDS_PROBE.code, {
    filePath: path.join(ROOT, PRIVATE_FIELDS_PROBE.file),
  });

  return report.messages
    .filter(({ ruleId }) => ruleId === 'no-restricted-syntax')
    .map(({ line }) => line);
}

/**
 * Runs the worker in a child process with `env`, which selects the profile.
 * @param {NodeJS.ProcessEnv} env The child's environment.
 * @returns {object} What the child printed after MARKER, or `{ thrown }`.
 */
function lintWith(env) {
  const child = spawnSync(process.execPath, [import.meta.filename, '--worker'], {
    cwd: ROOT,
    env,
    encoding: 'utf8',
    timeout: 120_000,
  });
  const line = child.stdout?.split('\n').find(text => text.startsWith(MARKER));
  if (child.error || child.status !== 0 || !line) {
    const cause = child.error
      ? `failed (${child.error.code ?? child.error.message}; the timeout is 120 s)`
      : `exited with ${child.status ?? child.signal}`;
    const stderr = (child.stderr ?? '').trim().split('\n').slice(-3).join(' | ');

    return { thrown: `the worker ${cause}: ${stderr}` };
  }

  return JSON.parse(line.slice(MARKER.length));
}

/**
 * Reads the fixture's `expect:` comments. Each one ends the line of code it describes.
 * @returns {{expected: string[], misplaced: number[]}} The findings, sorted, as
 *   "line N: rule severity", and the numbers of lines where an `expect:` comment has no code.
 */
function readExpectations() {
  const lines = readFileSync(FIXTURE, 'utf8').split('\n');
  const misplaced = lines
    .map((text, index) => (/^\s*\/\/ expect:/.test(text) ? index + 1 : 0))
    .filter(Boolean);
  const expected = lines
    .flatMap((text, index) => {
      const wanted = text.match(/\S.*\/\/ expect: (.+)$/)?.[1];

      return (wanted?.split(',') ?? []).map(entry => {
        const [rule, severity] = entry.trim().split(' ');

        return `line ${index + 1}: @typescript-eslint/${rule} ${severity}`;
      });
    })
    .sort();

  return { expected, misplaced };
}

/**
 * Lints the fixture with both profiles and exits 1 on any failure.
 */
function main() {
  const { expected, misplaced } = readExpectations();
  const typedFindings = messages =>
    messages
      .filter(({ ruleId }) => TYPED_RULES.includes(ruleId))
      .map(({ line, ruleId, severity }) => `line ${line}: ${ruleId} ${SEVERITIES[severity]}`)
      .sort();
  const failures = [
    ...misplaced.map(line => `fixture line ${line}: an expect: comment must end a line of code`),
    ...TYPED_RULES.filter(rule => !expected.some(entry => entry.includes(` ${rule} `))).map(
      rule => `the fixture has no expect: comment for ${rule}`
    ),
  ];

  const check = (name, result, isTyped) => {
    if (result.thrown) {
      failures.push(`${name}: ESLint threw: ${result.thrown.split('\n')[0]}`);

      return;
    }
    for (const { message } of result.messages.filter(({ fatal }) => fatal)) {
      failures.push(`${name}: ${message}`);
    }
    const rules = result.rulesNeedingTypes.join(', ');
    const found = typedFindings(result.messages);
    if (isTyped) {
      if (rules !== TYPED_RULES.join(', ')) {
        failures.push(
          `${name}: the rules that need types are [${rules}], not [${TYPED_RULES.join(', ')}]`
        );
      }
      if (found.join() !== expected.join()) {
        failures.push(
          `${name}: expected ${expected.join('; ')}; got ${found.join('; ') || 'none'}`
        );
      }
    } else {
      if (rules) failures.push(`${name}: rules that need types are on: ${rules}`);
      if (found.length > 0) failures.push(`${name}: reports ${found.join('; ')}`);
      if (result.asksForProgram) {
        failures.push(`${name}: sets parserOptions.project or projectService`);
      }
      if (result.scan.blocks === 0) failures.push(`${name}: the config scan read no block`);
      result.scan.offenders.forEach(offender => failures.push(`${name}: ${offender}`));
      if (result.sweep.probed === 0) failures.push(`${name}: the config sweep probed no file`);
      result.sweep.offenders.forEach(offender => failures.push(`${name}: ${offender}`));
      if (result.privateFields.join() !== PRIVATE_FIELDS_PROBE.lines.join()) {
        failures.push(
          `${name}: the private-fields rule reported lines [${result.privateFields.join(', ')}] of ` +
            `the probe, not [${PRIVATE_FIELDS_PROBE.lines.join(', ')}] (its \`private\` field)`
        );
      }
    }
  };

  const { ESLINT_TYPED, ...env } = process.env;
  const typed = lintWith({ ...env, ESLINT_TYPED: '1' });
  const fast = lintWith(env);
  check('typed profile (ESLINT_TYPED=1)', typed, true);
  check('fast profile', fast, false);
  if (process.env.CI === 'true' && ESLINT_TYPED !== '1') {
    failures.push('CI=true without ESLINT_TYPED=1: the CI lint would run the fast profile');
  }

  if (failures.length > 0) {
    failures.forEach(failure => console.error(`✗ ${failure}`));
    process.exit(1);
  }
  console.log(`✓ typed profile: ${expected.join('; ')}`);
  console.log(
    `✓ fast profile: no rule that needs types and no TypeScript program, on the fixture, in ` +
      `${fast.scan.blocks} blocks of the ESLint configs and for ${fast.sweep.probed} virtual ` +
      `files; no error`
  );
  console.log('✓ private-fields rule: reports a `private` field, not a `#` field or a method');
}

if (process.argv[2] === '--worker') {
  await lintFixture();
} else {
  main();
}
