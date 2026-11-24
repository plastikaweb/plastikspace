#!/usr/bin/env node
/**
 * META-15: tests tools/scripts/check-eco-conventions.cjs.
 *
 * - Fixture workspaces in temporary git repos (files left untracked, as the
 *   check lists them with `git ls-files -co`): a clean tree that holds every
 *   near miss, one fixture per rule, the allow markers, --files routing, the
 *   JSON output and the fatal cases (exit 2).
 * - The real tree passes.
 *
 * The check runs in the pre-commit, so the clean fixture matters as much as the
 * failing ones: a false positive there blocks commits.
 *
 * Run: yarn eco-conventions:test (CI: the Lint Affected step of .github/workflows/ci.yml).
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHECK = path.join(import.meta.dirname, 'check-eco-conventions.cjs');
const LIB = 'libs/eco-store/probe/src/lib';
const failures = [];
const temps = [];

/**
 * Builds a fixture workspace in a new git repo.
 * @param {Record<string, string>} files Path → content.
 * @returns {string} The workspace root.
 */
function workspace(files) {
  const root = mkdtempSync(path.join(tmpdir(), 'eco-conventions-'));
  temps.push(root);
  execFileSync('git', ['init', '-q'], { cwd: root });
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), content);
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
 * @param {Record<string, string>} files The fixture files.
 * @param {number} status The expected exit code.
 * @param {string[]} expected The expected findings, as `rule file:line`, sorted.
 * @param {string[]} [args] Extra arguments, such as --files.
 * @returns {{ files: string[], findings: object[] } | undefined} The report, when the exit code matched.
 */
function expectFindings(name, files, status, expected, args = []) {
  const result = run(['--json', '--root', workspace(files), ...args]);
  if (result.status !== status) {
    failures.push(`${name}: exit ${result.status}, expected ${status}. ${result.stderr.trim()}`);

    return undefined;
  }
  const report = JSON.parse(result.stdout);
  const found = report.findings.map(({ rule, file, line }) => `${rule} ${file}:${line}`).sort();
  if (JSON.stringify(found) !== JSON.stringify([...expected].sort())) {
    failures.push(`${name}: found [${found.join(', ')}], expected [${expected.join(', ')}]`);
  } else {
    console.log(`✓ ${name}`);
  }

  return report;
}

/**
 * Runs the check on a fixture that must stop with exit 2.
 * @param {string} name The case name.
 * @param {string[]} args Its arguments.
 * @param {RegExp} message What stderr must say.
 */
function expectFatal(name, args, message) {
  const result = run(args);
  if (result.status !== 2 || !message.test(result.stderr)) {
    failures.push(
      `${name}: exit ${result.status}, stderr "${result.stderr.trim()}"; expected exit 2 and ${message}`
    );
  } else {
    console.log(`✓ ${name}`);
  }
}

const CLEAN = {
  [`${LIB}/form.component.html`]: [
    '<mat-form-field>',
    '  <input matInput formControlName="name" />',
    '  <textarea',
    '    matInput',
    '    [rows]="3"></textarea>',
    '</mat-form-field>',
    '<select [disabled]="count > 2" matNativeControl></select>',
    '<!-- <input type="text"> in a comment -->',
    '<p>An input-like word: <inputs> and <input-group></input-group></p>',
    '',
  ].join('\n'),
  [`${LIB}/inline.component.ts`]: [
    "import { Component } from '@angular/core';",
    '// template: `<input>` in a comment',
    '/* template: `<select>` */',
    "const note = 'template: `<textarea>`';",
    'const parts = [',
    '  // template:',
    '  `<input>`,',
    '];',
    '@Component({',
    "  selector: 'eco-probe',",
    '  template: `<input matInput [title]="${label}" />`,',
    '})',
    'export class ProbeComponent {',
    '  readonly html = `<input>`;',
    '}',
    '',
  ].join('\n'),
  [`${LIB}/probe.component.scss`]: [
    '// color: #ffffff; a hex in a line comment',
    '/* background: #000; a hex in a block comment */',
    '#main, #bad, #cafe { color: var(--mat-sys-primary); }',
    '.a-#{$name} { color: var(--mat-sys-on-surface); }',
    '.b { background: url(https://example.com/#fff.png); content: "#abc"; }',
    ':host { --eco-local: var(--mat-sys-surface); }',
    '/* ::ng-deep in a comment */',
    '',
  ].join('\n'),
  'apps/eco-admin/src/styles/_base.scss': [
    ':root {',
    '  /* eco:check allow raw-hex: no Material role for this mock colour */',
    '  --eco-admin-page-background: light-dark(#f2f5ea, #11140e);',
    '}',
    '',
  ].join('\n'),
  'libs/eco/styles/src/_eco_tokens.css':
    ':root { --mat-sys-primary: light-dark(#356a1f, #9ad67d); }\n',
  'apps/eco-store/src/styles/fresh-theme.css': ':root { --mat-sys-surface: #fafaf5; }\n',
  'libs/core/styles/src/_palette.scss': '$green: #356a1f;\n',
  'apps/nasa-images/src/app/search.component.html': '<input type="search" />\n',
  [`${LIB}/form.component.spec.ts`]:
    "const host = `<input type='text' />`; // template: `<input>`\n",
  [`${LIB}/README.md`]: '```html\n<input type="text" />\n```\n',
};

try {
  expectFindings('the clean tree passes, near misses included', CLEAN, 0, []);

  expectFindings(
    'a bare <input>, <select> or <textarea> fails (bare-form-control)',
    {
      [`${LIB}/a.component.html`]: [
        '<form>',
        '  <input type="text" formControlName="name">',
        '  <select [value]="x"></select>',
        '  <textarea',
        '    formControlName="notes"',
        '    [placeholder]="a > b ? matInput : none"></textarea>',
        '  <INPUT matinput />',
        '</form>',
        '',
      ].join('\n'),
      [`${LIB}/b.component.ts`]: [
        '@Component({',
        "  selector: 'eco-b',",
        '  template: `',
        '    <label for="q">Search</label>',
        '    <input id="q" />',
        '  `,',
        '})',
        'export class BComponent {}',
        '',
      ].join('\n'),
      [`${LIB}/c.component.ts`]: [
        '@Component({',
        '  template: `<p>${[`a`].join()}</p>',
        '    <select></select>`,',
        '})',
        'export class CComponent {}',
        '',
      ].join('\n'),
    },
    1,
    [
      `bare-form-control ${LIB}/a.component.html:2`,
      `bare-form-control ${LIB}/a.component.html:3`,
      `bare-form-control ${LIB}/a.component.html:4`,
      `bare-form-control ${LIB}/a.component.html:7`,
      `bare-form-control ${LIB}/b.component.ts:5`,
      `bare-form-control ${LIB}/c.component.ts:3`,
    ]
  );

  expectFindings(
    'a hex colour in eco styles fails (raw-hex), outside the token sources',
    {
      [`${LIB}/a.component.scss`]: [
        '$accent: #abcdef;',
        '.a {',
        '  color: #fff;',
        '  border: 1px solid',
        '    #12345678;',
        '  background: light-dark(#f2f5ea, #11140e)',
        '}',
        '@include mixins.ring(#c0ffee);',
        '',
      ].join('\n'),
      'apps/eco-admin/src/styles/loading.css': 'body { background: #0b0b0b; }\n',
    },
    1,
    [
      `raw-hex ${LIB}/a.component.scss:1`,
      `raw-hex ${LIB}/a.component.scss:3`,
      `raw-hex ${LIB}/a.component.scss:5`,
      `raw-hex ${LIB}/a.component.scss:6`,
      `raw-hex ${LIB}/a.component.scss:6`,
      `raw-hex ${LIB}/a.component.scss:8`,
      'raw-hex apps/eco-admin/src/styles/loading.css:1',
    ]
  );

  expectFindings(
    'a --mat-sys-* declaration in eco styles fails (sys-redefined)',
    {
      [`${LIB}/a.component.scss`]: [
        ':host {',
        '  --mat-sys-primary: var(--mat-sys-tertiary);',
        '  color: var(--mat-sys-primary);',
        '}',
        '@each $role in (primary, secondary) {',
        '  .x-#{$role} { --mat-sys-#{$role}: red; }',
        '}',
        '',
      ].join('\n'),
    },
    1,
    [`sys-redefined ${LIB}/a.component.scss:2`, `sys-redefined ${LIB}/a.component.scss:6`]
  );

  expectFindings(
    '::ng-deep is listed as info and does not fail',
    {
      [`${LIB}/a.component.scss`]: ':host {\n  ::ng-deep .card { display: block; }\n}\n',
    },
    0,
    [`ng-deep ${LIB}/a.component.scss:2`]
  );

  expectFindings(
    'an allow marker needs the rule, a reason and the line right before',
    {
      [`${LIB}/a.component.scss`]: [
        '/* eco:check allow sys-redefined: stacked markers both count */',
        '/* eco:check allow raw-hex: a reason */',
        ':host { --mat-sys-primary: #123456; }',
        '/* eco:check allow raw-hex: */',
        '.b { color: #fff; }',
        '/* eco:check allow sys-redefined: the wrong rule */',
        '.c { color: #fff; }',
        '/* eco:check allow raw-hex: two lines above */',
        '',
        '.d { color: #fff; }',
        '// eco:check allow raw-hex: a line comment is no marker',
        '.e { color: #fff; }',
        '',
      ].join('\n'),
      [`${LIB}/a.component.html`]: [
        '<!-- eco:check allow bare-form-control: a hidden file picker behind a mat-button -->',
        '<input type="file" hidden />',
        '<!-- eco:check allow bare-form-control -->',
        '<input type="file" hidden />',
        '',
      ].join('\n'),
    },
    1,
    [
      `raw-hex ${LIB}/a.component.scss:5`,
      `raw-hex ${LIB}/a.component.scss:7`,
      `raw-hex ${LIB}/a.component.scss:10`,
      `raw-hex ${LIB}/a.component.scss:12`,
      `bare-form-control ${LIB}/a.component.html:4`,
    ]
  );

  const routed = expectFindings(
    '--files checks only the eco files it is given',
    {
      [`${LIB}/a.component.scss`]: '.a { color: #fff; }\n',
      [`${LIB}/b.component.scss`]: '.b { color: #000; }\n',
      [`${LIB}/a.component.spec.ts`]: 'const t = `<input>`;\n',
      'libs/shared/x/src/x.component.html': '<input />\n',
      'apps/eco-store/project.json': '{}\n',
    },
    1,
    [`raw-hex ${LIB}/a.component.scss:1`],
    [
      '--files',
      `${LIB}/a.component.scss`,
      `${LIB}/a.component.spec.ts`,
      'libs/shared/x/src/x.component.html',
      'apps/eco-store/project.json',
    ]
  );
  if (routed && JSON.stringify(routed.files) !== JSON.stringify([`${LIB}/a.component.scss`])) {
    failures.push(`--files routing: checked [${routed.files.join(', ')}]`);
  }

  const text = run([
    '--root',
    workspace({ [`${LIB}/a.component.scss`]: '.a {\n  color: #fff;\n}\n' }),
  ]);
  if (
    text.status === 1 &&
    text.stdout.includes(`${LIB}/a.component.scss:2  error raw-hex`) &&
    text.stdout.includes('errors: 1, info: 0')
  ) {
    console.log('✓ the text output prints file:line, severity, rule and detail');
  } else {
    failures.push(`text output: exit ${text.status}\n${text.stdout}${text.stderr}`);
  }

  expectFatal('an unknown argument stops with exit 2', ['--nope'], /Unknown argument: --nope/);
  expectFatal(
    'a --files path that does not exist stops with exit 2',
    ['--root', workspace({}), '--files', `${LIB}/gone.component.html`],
    /gone\.component\.html: no such file/
  );
  const noGit = mkdtempSync(path.join(tmpdir(), 'eco-conventions-nogit-'));
  temps.push(noGit);
  expectFatal('a root outside git stops with exit 2', ['--root', noGit], /git ls-files failed/);

  const real = run([]);
  if (real.status === 0)
    console.log(`✓ the real tree passes: ${real.stdout.trim().split('\n').pop()}`);
  else failures.push(`the real tree: exit ${real.status}\n${real.stdout}${real.stderr}`);
} finally {
  temps.forEach(dir => rmSync(dir, { recursive: true, force: true }));
}

if (failures.length > 0) {
  console.error(
    `\n✗ check-eco-conventions tests: ${failures.length} failed\n- ${failures.join('\n- ')}`
  );
  process.exitCode = 1;
} else {
  console.log('\n✓ check-eco-conventions tests passed');
}
