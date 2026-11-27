#!/usr/bin/env node
/**
 * META-22: grades one run of the form-field eval (tools/evals/form-field/run.mjs).
 *
 * The task asks for a delivery-method filter on the eco-store orders list. The grade reads
 * what the run left in its worktree against the commit it started from, and runs no model.
 *
 * Form rules (.claude/CLAUDE.md «Forms», apps/eco-store/CLAUDE.md «i18n specifics»):
 *   inConfig      The filter form config declares a `deliveryMethod` field of a Formly type
 *                 the route registers (`select` or `select-with-icons`).
 *   noHandControl No form control written by hand in a template (<select>, <input>,
 *                 <textarea>, <mat-select>, matInput, <mat-form-field>), and
 *                 check-eco-conventions passes on the eco files the run changed.
 *   translated    Every label, placeholder or option label the run added is a translation
 *                 key present in ca, es and en, and none is written out as text; a run
 *                 that adds no key at all (no label for the new field) fails it.
 *   i18nValid     tools/scripts/validate-i18n-keys.cjs passes.
 *   tests         With --tests: vitest of the two orders projects passes. The route registers
 *                 `select`, but the list spec's TestBed registers only `input-search` and
 *                 `select-with-icons`: a `select` field must be registered there too.
 * Pass: all of them.
 *
 * Reported, not part of the pass: `wired` (the orders store's filter state and type hold
 * deliveryMethod, so the field reaches the PocketBase query), `commits` made, and files
 * changed outside the orders libs, the eco entities and the eco-store i18n files.
 *
 * Usage: node tools/evals/form-field/grade.mjs <worktree> <base-commit> [--tests]
 * Prints one JSON object.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [worktree, base] = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
const withTests = process.argv.includes('--tests');

if (!worktree || !base) {
  console.error('Usage: node tools/evals/form-field/grade.mjs <worktree> <base-commit> [--tests]');
  process.exit(2);
}

const CONFIG = 'libs/eco-store/orders/feature/list/src/lib/eco-store-orders-filter-form.config.ts';
const STORE = 'libs/eco-store/orders/data-access/src/eco-store-orders.store.ts';
const I18N = ['ca', 'es', 'en'].map(lang => `apps/eco-store/public/i18n/${lang}.json`);
const EXPECTED_SCOPE =
  /^(libs\/eco-store\/orders\/|libs\/eco\/entities\/|apps\/eco-store\/public\/i18n\/)/;
const HAND_CONTROL = /<(select|input|textarea|mat-select|mat-form-field)(?=[\s/>]|$)|\bmatInput\b/;
const REGISTERED_TYPES = new Set(['select', 'select-with-icons']);
const KEY_LITERAL = /^[a-z][A-Za-z0-9]*(\.[A-Za-z0-9]+)+$/;

/**
 * Runs a command in the worktree.
 * @param {string} cmd The command.
 * @param {string[]} args Its arguments.
 * @returns {{ status: number | null, out: string }} Exit status and output.
 */
function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd: worktree,
    encoding: 'utf8',
    maxBuffer: 1 << 28,
    env: {
      ...process.env,
      NX_NO_CLOUD: 'true',
      NX_DAEMON: 'false',
      NX_WORKSPACE_ROOT_PATH: worktree,
    },
  });

  return { status: result.status, out: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

/**
 * Reads a file of the worktree.
 * @param {string} file Path from the worktree root.
 * @returns {string} Its content, or an empty string.
 */
function read(file) {
  try {
    return fs.readFileSync(path.join(worktree, file), 'utf8');
  } catch {
    return '';
  }
}

/**
 * Looks a dotted key up in a translation object.
 * @param {object} json The parsed translation file.
 * @param {string} key The dotted key.
 * @returns {boolean} Whether it holds a string.
 */
function hasKey(json, key) {
  const value = key
    .split('.')
    .reduce((node, part) => (node && typeof node === 'object' ? node[part] : undefined), json);

  return typeof value === 'string';
}

// New files count as changes: intent-to-add puts them in the diff without staging content.
run('git', ['add', '-A', '-N']);
const changed = run('git', ['diff', '--name-only', base]).out.split('\n').filter(Boolean);
const diff = run('git', ['diff', '--unified=0', '--no-color', base]).out;
const added = {};
let current = '';

for (const line of diff.split('\n')) {
  if (line.startsWith('+++ ')) current = line.replace(/^\+\+\+ (b\/)?/, '');
  else if (line.startsWith('+') && current) (added[current] ??= []).push(line.slice(1));
}

// inConfig: the field and its type, read from the config as the run left it.
const config = read(CONFIG);
const fieldAt = config.search(/key:\s*['"]deliveryMethod['"]/);
const fieldBlock = fieldAt === -1 ? '' : config.slice(Math.max(0, fieldAt - 300), fieldAt + 1200);
const fieldType = fieldBlock.match(/type:\s*['"]([\w-]+)['"]/)?.[1] ?? '';
const inConfig = fieldAt !== -1 && REGISTERED_TYPES.has(fieldType);

// noHandControl: added template markup, then the repo's own check on the changed eco files.
const handControls = Object.entries(added).flatMap(([file, lines]) =>
  /\.(html|ts)$/.test(file) && !file.endsWith('.spec.ts')
    ? lines
        .filter(line => HAND_CONTROL.test(line) && (file.endsWith('.html') || /<\w/.test(line)))
        .map(line => `${file}: ${line.trim()}`)
    : []
);
const ecoChanged = changed.filter(
  file =>
    /^(apps\/eco-[^/]+|libs\/eco[^/]*)\//.test(file) && fs.existsSync(path.join(worktree, file))
);
const conventions = ecoChanged.length
  ? run('node', ['tools/scripts/check-eco-conventions.cjs', '--files', ...ecoChanged])
  : { status: 0, out: '' };
const noHandControl = handControls.length === 0 && conventions.status === 0;

// translated: labels, placeholders and option labels the run added in TypeScript.
const translations = I18N.map(file => {
  try {
    return JSON.parse(read(file));
  } catch {
    return {};
  }
});
const labelValues = Object.entries(added)
  .filter(([file]) => file.endsWith('.ts') && !file.endsWith('.spec.ts'))
  .flatMap(([file, lines]) =>
    lines.flatMap(line =>
      [...line.matchAll(/\b(label|placeholder|description)\s*:\s*['"`]([^'"`]*)['"`]/g)].map(m => ({
        file,
        value: m[2],
      }))
    )
  );
const keysUsed = new Set([
  ...labelValues.filter(({ value }) => KEY_LITERAL.test(value)).map(({ value }) => value),
  ...Object.entries(added)
    .filter(([file]) => file.endsWith('.ts') && !file.endsWith('.spec.ts'))
    .flatMap(([, lines]) =>
      lines.flatMap(line =>
        [...line.matchAll(/['"`]((?:orders|common)\.[A-Za-z0-9.]+)['"`]/g)].map(m => m[1])
      )
    ),
]);
const literalLabels = labelValues.filter(
  ({ value }) => value && !value.includes('${') && !KEY_LITERAL.test(value)
);
const missingKeys = [...keysUsed].flatMap(key =>
  ['ca', 'es', 'en'].filter((_, i) => !hasKey(translations[i], key)).map(lang => `${lang}: ${key}`)
);
const translated = keysUsed.size > 0 && literalLabels.length === 0 && missingKeys.length === 0;

const i18nValid = run('node', ['tools/scripts/validate-i18n-keys.cjs']).status === 0;

// Reported only.
const store = read(STORE);
const wired =
  /interface OrdersPocketBaseFilter[^}]*\bdeliveryMethod\??\s*:/.test(store) &&
  /filter:\s*\{[^}]*\bdeliveryMethod\s*:/.test(store);
const commits = Number(run('git', ['rev-list', '--count', `${base}..HEAD`]).out.trim() || 0);
const outside = changed.filter(file => !EXPECTED_SCOPE.test(file));
let tests = null;

if (withTests) {
  tests =
    run('yarn', [
      'nx',
      'run-many',
      '-t',
      'test',
      '-p',
      'eco-store-orders-list',
      'eco-store-orders-data-access',
      '--skip-nx-cache',
      '--output-style=static',
    ]).status === 0;
}

console.log(
  JSON.stringify(
    {
      pass: inConfig && noHandControl && translated && i18nValid && tests !== false,
      inConfig,
      noHandControl,
      translated,
      i18nValid,
      wired,
      tests,
      commits,
      fieldType,
      handControls,
      conventionsOutput: conventions.status === 0 ? '' : conventions.out.slice(0, 600),
      literalLabels,
      missingKeys,
      keysUsed: [...keysUsed],
      changed,
      outside,
    },
    null,
    2
  )
);
