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
 *   none of those findings. In every folder with an eslint.config.mjs, a virtual .ts, .mts, .cts,
 *   .tsx and .spec.ts file gets no rule that needs types and no parser option that asks for a
 *   TypeScript program, so no project config brings one back into the hooks.
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

const ROOT = path.resolve(import.meta.dirname, '../..');
const FIXTURE = path.join(import.meta.dirname, 'fixtures/eslint-profiles/typed-rules.ts');
const TYPED_RULES = [
  '@typescript-eslint/naming-convention',
  '@typescript-eslint/no-deprecated',
  '@typescript-eslint/prefer-readonly',
].sort();
const PROBE_EXTENSIONS = ['ts', 'mts', 'cts', 'tsx', 'spec.ts'];
const MARKER = '@@eslint-profile@@';
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
 * Fast profile only: probes a virtual file of each extension in every folder with an ESLint
 * config, with the ignores real runs apply, for a program or a rule that needs types.
 * @param {typeof import('eslint').ESLint} ESLint The ESLint class.
 * @returns {Promise<{probed: number, offenders: string[]}>} What it probed and what failed.
 */
async function sweepConfigs(ESLint) {
  const eslint = new ESLint({ cwd: ROOT });
  const folders = execFileSync('git', ['ls-files', '-z', '--', '*eslint.config.mjs'], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean)
    .map(file => path.dirname(file));
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
 * profile, sweeps the configs), then prints the result after MARKER.
 * @returns {Promise<void>}
 */
async function lintFixture() {
  const { ESLint } = await import('eslint');
  // The root config ignores every folder beside apps/ and libs/. `ignore: false` lifts that; the
  // config is still the one ESLint finds for the fixture, the root eslint.config.mjs.
  const eslint = new ESLint({ cwd: ROOT, ignore: false });
  let result;
  try {
    const config = await eslint.calculateConfigForFile(FIXTURE);
    const [report] = await eslint.lintFiles([FIXTURE]);
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
      sweep: process.env.ESLINT_TYPED === '1' ? null : await sweepConfigs(ESLint),
    };
  } catch (error) {
    result = { thrown: String(error?.message ?? error) };
  }
  // After a marker: @nx/enforce-module-boundaries prints a warning on stdout when no cached
  // project graph exists.
  process.stdout.write(`\n${MARKER}${JSON.stringify(result)}\n`);
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
      if (result.sweep.probed === 0) failures.push(`${name}: the config sweep probed no file`);
      result.sweep.offenders.forEach(offender => failures.push(`${name}: ${offender}`));
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
    `✓ fast profile: no rule that needs types and no TypeScript program, on the fixture and ` +
      `${fast.sweep.probed} virtual files of the ESLint configs; no error`
  );
}

if (process.argv[2] === '--worker') {
  await lintFixture();
} else {
  main();
}
