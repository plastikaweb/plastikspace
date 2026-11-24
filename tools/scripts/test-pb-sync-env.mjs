#!/usr/bin/env node
/**
 * META-37: apps/eco-store/scripts/sync-pocketbase-schema.js overwrites the schema of the
 * instance POCKETBASE_ENV names, and refuses to run without a name it knows.
 *
 * Every run uses a copy of the script in a fixture under tmp/ (inside the repo, so `pocketbase`
 * resolves) with no src/environments: even a broken gate stops at reading the environment file,
 * before any network call. The children get no POCKETBASE_* variable from this process.
 *
 * - Refused (exit 2, before .env is read): unset, empty, an unknown name, a wrong case, and a
 *   POCKETBASE_ENV that only the fixture's .env sets.
 * - Accepted: development and staging get past the gate to the environment file.
 * - Callers: the deploy workflow and populate-pocketbase.js name their target.
 *
 * Run: yarn pb-sync:test (CI: the Lint Affected step of .github/workflows/ci.yml).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const SCRIPTS = path.join(ROOT, 'apps/eco-store/scripts');
const WORKFLOW = path.join(ROOT, '.github/workflows/pocketbase-schema.yml');

const failures = [];

/**
 * Records a check.
 * @param {string} name The case name.
 * @param {boolean} passed Whether it passed.
 * @param {string} [detail] What was found instead.
 */
function check(name, passed, detail = '') {
  if (passed) console.log(`✓ ${name}`);
  else failures.push(`${name}${detail ? `: ${detail}` : ''}`);
}

/**
 * Copies the script and its helper into a fixture with a .env and no environment files.
 * @param {string} dotEnv The fixture's .env content.
 * @returns {string} The fixture folder.
 */
function makeFixture(dotEnv) {
  fs.mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
  const fixture = fs.mkdtempSync(path.join(ROOT, 'tmp', 'pb-sync-env-'));
  const scripts = path.join(fixture, 'scripts');

  fs.mkdirSync(scripts);
  for (const file of ['sync-pocketbase-schema.js', 'load-environment.js', 'package.json']) {
    fs.copyFileSync(path.join(SCRIPTS, file), path.join(scripts, file));
  }
  fs.writeFileSync(path.join(fixture, '.env'), dotEnv);

  return fixture;
}

/**
 * Runs the fixture's copy of the script.
 * @param {string} fixture The fixture folder.
 * @param {string | undefined} target The POCKETBASE_ENV to pass, or undefined for none.
 * @returns {{ status: number | null, out: string }} Its exit status and its whole output.
 */
function runSync(fixture, target) {
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => !key.startsWith('POCKETBASE_'))
  );

  if (target !== undefined) env.POCKETBASE_ENV = target;
  const result = spawnSync(
    process.execPath,
    [path.join(fixture, 'scripts', 'sync-pocketbase-schema.js')],
    {
      cwd: fixture,
      env,
      encoding: 'utf8',
      timeout: 20000,
    }
  );

  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

const fixtures = [];

try {
  const plain = makeFixture('');
  const withDotEnv = makeFixture('POCKETBASE_ENV=staging\n');

  fixtures.push(plain, withDotEnv);

  for (const [name, target] of [
    ['unset', undefined],
    ['empty', ''],
    ['unknown name', 'production'],
    ['wrong case', 'Staging'],
  ]) {
    const { status, out } = runSync(plain, target);

    check(
      `refuses POCKETBASE_ENV ${name} with exit 2, naming both targets`,
      status === 2 &&
        out.includes('POCKETBASE_ENV=development yarn eco-store:pb:sync') &&
        out.includes('POCKETBASE_ENV=staging yarn eco-store:pb:sync') &&
        !out.includes('Using environment'),
      `exit ${status}, output: ${out.slice(0, 300)}`
    );
  }

  const fromDotEnv = runSync(withDotEnv, undefined);

  check(
    'ignores a POCKETBASE_ENV that only apps/eco-store/.env sets',
    fromDotEnv.status === 2 && fromDotEnv.out.includes('POCKETBASE_ENV is not set'),
    `exit ${fromDotEnv.status}, output: ${fromDotEnv.out.slice(0, 300)}`
  );

  for (const target of ['development', 'staging']) {
    const { status, out } = runSync(plain, target);

    check(
      `accepts ${target} and goes on to its environment file`,
      status !== 2 && out.includes(`Error loading environment '${target}'`),
      `exit ${status}, output: ${out.slice(0, 300)}`
    );
  }
} finally {
  for (const fixture of fixtures) fs.rmSync(fixture, { recursive: true, force: true });
}

const workflow = fs.readFileSync(WORKFLOW, 'utf8');
const syncStep = workflow.match(
  /run: node apps\/eco-store\/scripts\/sync-pocketbase-schema\.js\n(?:\s+.*\n)*?\s+env:\n((?:\s{10}.*\n)+)/
);

check(
  'the deploy workflow names staging on its sync step',
  Boolean(syncStep) && /^\s+POCKETBASE_ENV: staging$/m.test(syncStep[1]),
  syncStep ? syncStep[1] : 'sync step not found'
);

const populate = fs.readFileSync(path.join(SCRIPTS, 'populate-pocketbase.js'), 'utf8');

check(
  'populate-pocketbase.js runs the sync against development',
  /execSync\(`node "\$\{SYNC_SCRIPT\}"`,\s*\{[^}]*POCKETBASE_ENV: 'development'/.test(populate)
);

if (failures.length) {
  console.error(`\n✗ ${failures.length} check(s) failed:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('\nAll pb:sync target checks passed.');
