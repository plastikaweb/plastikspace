// Root ESLint flat config. Every project's eslint.config.mjs spreads it and then adds its own
// blocks; the five Cypress e2e configs put the Cypress preset before it, as their .eslintrc.json
// did. The blocks keep the order of the overrides of the former .eslintrc.json, so a later block
// wins where a later override did. META-25 converted it; the comments say where flat config needs
// something eslintrc did on its own.
//
// Two profiles (META-13). By default no rule needs type information, so ESLint builds no
// TypeScript program: hooks, editors and local runs. ESLINT_TYPED=1 (CI's lint step and
// `yarn lint:ci`) adds the three rules that need it, in the last but one block. Without a program,
// cypress/unsafe-to-chain-command (e2e configs) also skips chains that start at a helper function.
// `yarn lint:profiles` checks both profiles.
import nx from '@nx/eslint-plugin';
import ngrxConfigs from '@ngrx/eslint-plugin/v9';
import angular from 'angular-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import globals from 'globals';
import jsoncParser from 'jsonc-eslint-parser';
import tseslint from 'typescript-eslint';

const TS = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];
const TS_SPECS = ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.mts', '**/*.spec.cts'];
const JS = ['**/*.js', '**/*.jsx'];
const ngrx = ngrxConfigs.configs.store[0].plugins['@ngrx'];
const isTyped = process.env.ESLINT_TYPED === '1';

// naming-convention selectors that work without type information.
const NAMING = [
  {
    selector: 'default',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
    trailingUnderscore: 'allow',
  },
  {
    selector: 'variable',
    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
    leadingUnderscore: 'allow',
    trailingUnderscore: 'allow',
  },
  {
    selector: 'import',
    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
  },
  {
    selector: 'typeLike',
    format: ['PascalCase'],
  },
  {
    selector: 'enumMember',
    format: ['PascalCase', 'UPPER_CASE'],
  },
  {
    selector: 'property',
    format: null,
  },
  {
    selector: 'parameter',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },
];
// The one that needs it, typed profile only: a boolean variable needs a prefix. The rule tries
// selectors with `types` first, wherever they sit in the list.
const BOOLEAN_NAMING = {
  selector: 'variable',
  types: ['boolean'],
  format: ['PascalCase'],
  prefix: ['is', 'has', 'can', 'should', 'will'],
};
// TypeScript files the project service cannot place. It only looks in the nearest tsconfig.json
// and the tsconfigs that one references: the e2e Vite and Vitest configs are in a
// tsconfig.spec.json that the e2e tsconfig.json does not reference, the eco-store scripts are in no
// tsconfig, and the product-categories mock store is excluded by its tsconfig.lib.json. Unlisted,
// each stops the typed lint with a parse error ("was not found by the project service"); listed,
// it gets the options of tsconfig.base.json, as every non-spec file did before META-13. A listed
// file that one of those tsconfigs later takes in is a parse error too ("was included by
// allowDefaultProject but also was found in the project service"): take it off the list. The
// globs may not contain `**`, and at most 8 files of one lint task may match them.
const TS_DEFAULT_PROJECT = [
  'apps/*-e2e/vite.config.mts',
  'apps/*-e2e/vitest.config.mts',
  'apps/eco-store/scripts/*.ts',
  'libs/eco-store/product-categories/data-access/src/eco-store-product-categories.store.mock.ts',
];
// Untyped in both profiles. The 18 jest.config.cts files are dead (Jest is not installed) and
// cannot all go in the list above: the tsconfig.json of libs/eco-store/core/layout takes in its
// own. Wrangler generates worker-configuration.d.ts, which starts with `/* eslint-disable */`.
const TS_UNTYPED = ['**/jest.config.cts', '**/worker-configuration.d.ts'];

/**
 * Applies preset blocks to `files` minus `ignores` only, as `extends` inside an eslintrc override did.
 * It replaces each block's own `files`, which is safe while every block matches at least `files`.
 * @param {import('eslint').Linter.Config[]} configs Preset blocks.
 * @param {string[]} files Files the override matched.
 * @param {string[]} [ignores] Files the override excluded.
 * @returns {import('eslint').Linter.Config[]} The scoped blocks.
 */
const scoped = (configs, files, ignores = []) =>
  configs.map(config => ({
    ...config,
    files,
    ...(ignores.length > 0 && { ignores: [...(config.ignores ?? []), ...ignores] }),
  }));

export default [
  // Not linted: the former .eslintignore. Its names without a slash matched at any depth, hence
  // `**/`; its last line, `**/ .wrangler/`, was a typo for `.wrangler/`. Its two paths under
  // apps/eco-store moved to that app's config.
  {
    ignores: [
      '**/node_modules',
      '**/helpers',
      '**/.cursor',
      '**/.gemini',
      '**/.opencode',
      '**/.codex',
      '**/.claude',
      '**/.wrangler/',
    ],
  },
  // Not linted either: what eslintrc's root `ignorePatterns: ['**/*']` left out, since no project
  // config took it back: every file at the root, every folder beside apps/ and libs/ (dist, tmp,
  // tools, .agent...), and the eight paths under apps/ and libs/ that no ESLint config covers
  // today, seven folders and one file. Flat config lints whatever it does not ignore, with the
  // config nearest to each file, here this one, and the Nx plugin would infer a lint target for
  // .agent and tailwind-preset, which have a project file. `basePath` keeps the patterns relative
  // to the root wherever they are read: in the project configs that spread this one, and when the
  // Nx executor passes a project config with the root as cwd, which resolves every pattern without
  // a basePath from the root. A new folder or file under apps/ or libs/ without an ESLint config
  // is linted with this one.
  {
    basePath: import.meta.dirname,
    ignores: [
      '*',
      '!apps/',
      '!libs/',
      'apps/llecoop-firebase/',
      'libs/core/styles/util/material/',
      'libs/core/styles/util/tailwind4/',
      'libs/core/styles/util/tailwind-preset/',
      'libs/core/util/assets/',
      'libs/eco/styles/',
      'libs/shared/table/index.ts',
      'libs/shared/testing/',
    ],
  },
  ...nx.configs['flat/base'],
  // ESLint 9 started warning about eslint-disable comments that disable nothing; ESLint 8 did not.
  // Cleaning them up is a task of its own, so they stay unreported for now.
  { linterOptions: { reportUnusedDisableDirectives: 'off' } },
  // eslintrc registered these plugins for every file, so a directive in any file may name their rules.
  {
    plugins: {
      jsdoc,
      '@angular-eslint': angular.tsPlugin,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mts', '**/*.cts'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:util',
                'type:data-access',
                'type:entity',
                'scope:core',
                'scope:shared',
              ],
            },
            {
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags: ['scope:core', 'type:entity', 'type:util', 'scope:shared'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared', 'type:entity', 'type:util'],
            },
            {
              sourceTag: 'scope:nasa-images',
              onlyDependOnLibsWithTags: ['scope:nasa-images', 'scope:core', 'scope:shared'],
            },
            {
              sourceTag: 'scope:llecoop',
              onlyDependOnLibsWithTags: ['scope:llecoop', 'scope:core', 'scope:shared'],
            },
            {
              sourceTag: 'scope:plastikaweb',
              onlyDependOnLibsWithTags: ['scope:plastikaweb', 'scope:core', 'scope:shared'],
            },
            {
              sourceTag: 'scope:eco-store',
              onlyDependOnLibsWithTags: [
                'scope:eco-store',
                'scope:eco',
                'scope:core',
                'scope:shared',
              ],
            },
            {
              sourceTag: 'scope:eco',
              onlyDependOnLibsWithTags: ['scope:eco', 'scope:core', 'scope:shared'],
            },
            {
              sourceTag: 'scope:eco-admin',
              onlyDependOnLibsWithTags: [
                'scope:eco-admin',
                'scope:eco',
                'scope:core',
                'scope:shared',
              ],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:util',
                'type:data-access',
                'type:entity',
                'type:feature',
              ],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:entity', 'type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util', 'type:entity'],
            },
            {
              sourceTag: 'type:entity',
              onlyDependOnLibsWithTags: ['type:entity', 'type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:util', 'type:entity', 'type:data-access'],
            },
          ],
        },
      ],
    },
  },
  // The globals of the former spec override's `env: { jest: true }`. The `globals` package has since
  // dropped fdescribe, pit and require from its Jest set, so those three are listed by name. Specs
  // get no type information in either profile: the typed block leaves them out.
  {
    files: [
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.spec.js',
      '**/*.spec.jsx',
      '**/*.spec.mts',
      '**/*.spec.cts',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        fdescribe: 'readonly',
        pit: 'readonly',
        require: 'readonly',
      },
    },
  },
  ...scoped(nx.configs['flat/typescript'], TS, TS_SPECS),
  {
    files: TS,
    ignores: TS_SPECS,
    rules: {
      'no-console': 'error',
      'no-extra-semi': 'off',
    },
  },
  // The 25 rules of the former eslint-plugin-ngrx recommended set that @ngrx/eslint-plugin still
  // has, at the same severities. Its presets would turn them all into errors and add 10 rules.
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    plugins: {
      '@ngrx': ngrx,
    },
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      '@ngrx/avoid-combining-selectors': 'warn',
      '@ngrx/avoid-dispatching-multiple-actions-sequentially': 'warn',
      '@ngrx/avoid-duplicate-actions-in-reducer': 'warn',
      '@ngrx/avoid-mapping-selectors': 'warn',
      '@ngrx/good-action-hygiene': 'warn',
      '@ngrx/no-dispatch-in-effects': 'warn',
      '@ngrx/no-effects-in-providers': 'error',
      '@ngrx/no-multiple-global-stores': 'warn',
      '@ngrx/no-reducer-in-key-names': 'warn',
      '@ngrx/no-store-subscription': 'warn',
      '@ngrx/no-typed-global-store': 'warn',
      '@ngrx/on-function-explicit-return-type': 'warn',
      '@ngrx/prefer-action-creator': 'warn',
      '@ngrx/prefer-action-creator-in-dispatch': 'warn',
      '@ngrx/prefer-action-creator-in-of-type': 'warn',
      '@ngrx/prefer-concat-latest-from': 'warn',
      '@ngrx/prefer-effect-callback-in-block-statement': 'warn',
      '@ngrx/prefer-inline-action-props': 'warn',
      '@ngrx/prefer-one-generic-in-create-for-feature-selector': 'warn',
      '@ngrx/prefer-selector-in-select': 'warn',
      '@ngrx/prefix-selectors-with-select': 'warn',
      '@ngrx/select-style': 'error',
      '@ngrx/updater-explicit-return-type': 'warn',
      '@ngrx/use-consistent-global-store-name': 'warn',
      '@ngrx/use-effects-lifecycle-interface': 'warn',
    },
  },
  // Without typescript-eslint's eslint-recommended block: under eslintrc it applied to TypeScript
  // files only, and Nx's flat preset moves it onto JavaScript files, where it would turn off
  // no-undef and 17 more core rules and turn on no-var, prefer-const and 2 more.
  ...scoped(
    nx.configs['flat/javascript'].filter(
      config => config.name !== 'typescript-eslint/eslint-recommended'
    ),
    JS
  ),
  {
    files: JS,
    rules: {
      'no-extra-semi': 'off',
    },
  },
  {
    files: TS,
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'id-length': [
        'warn',
        {
          min: 2,
          max: 40,
          exceptions: ['i', 'j', 'x', 'y', 'k', 'v', 'm', 'e', 't', '_', 'id', 'db', 'fs'],
        },
      ],
      'id-denylist': ['warn', 'data', 'info', 'temp', 'val', 'item', 'foo', 'bar', 'baz'],
      'no-restricted-syntax': [
        'error',
        {
          selector: "ClassProperty[accessibility='private']",
          message: 'Use ES6 private fields (#) instead of the private modifier.',
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: ['signature', 'field', 'constructor', 'method'],
        },
      ],
      '@typescript-eslint/naming-convention': ['warn', ...NAMING],
      'padding-line-between-statements': [
        'warn',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
    },
  },
  ...scoped([jsdoc.configs['flat/recommended']], TS),
  {
    files: TS,
    rules: {
      'jsdoc/match-description': [
        'error',
        {
          matchDescription: '/^[A-Z].+[.]/',
        },
      ],
    },
  },
  ...scoped(
    [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    ['**/*.html']
  ),
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/no-positive-tabindex': 'error',
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/elements-content': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
      '@angular-eslint/template/label-has-associated-control': 'error',
      '@angular-eslint/template/mouse-events-have-key-events': 'error',
      '@angular-eslint/template/no-autofocus': 'error',
      '@angular-eslint/template/role-has-required-aria': 'error',
      '@angular-eslint/template/table-scope': 'error',
      '@angular-eslint/template/valid-aria': 'error',
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/no-input-prefix': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/component-max-inline-declarations': 'error',
      '@angular-eslint/template/use-track-by-function': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',
      '@angular-eslint/no-conflicting-lifecycle': 'error',
      '@angular-eslint/relative-url-prefix': 'error',
      '@angular-eslint/use-component-selector': 'error',
      '@angular-eslint/template/conditional-complexity': 'error',
      '@angular-eslint/use-injectable-provided-in': 'error',
      '@angular-eslint/no-inputs-metadata-property': 'error',
      '@angular-eslint/no-outputs-metadata-property': 'error',
      '@angular-eslint/no-queries-metadata-property': 'error',
      '@angular-eslint/template/no-distracting-elements': 'error',
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/template/attributes-order': 'error',
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-interpolation-in-attributes': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
    },
  },
  {
    files: ['**/*.json', '**/*.jsonc', '**/*.webmanifest'],
    languageOptions: {
      parser: jsoncParser,
    },
  },
  // The typed profile (ESLINT_TYPED=1): the three rules that need type information, on TypeScript
  // files that are not specs. The project service types each file with the program of its own
  // project, found from its nearest tsconfig.json and the tsconfigs that one references. Before
  // META-13 every lint task, hooks included, built one program of the whole monorepo from
  // tsconfig.base.json.
  ...(isTyped
    ? [
        {
          files: TS,
          ignores: [...TS_SPECS, ...TS_UNTYPED],
          languageOptions: {
            parserOptions: {
              projectService: {
                allowDefaultProject: TS_DEFAULT_PROJECT,
                defaultProject: 'tsconfig.base.json',
              },
              tsconfigRootDir: import.meta.dirname,
            },
          },
          rules: {
            '@typescript-eslint/prefer-readonly': 'error',
            '@typescript-eslint/no-deprecated': 'warn',
            '@typescript-eslint/naming-convention': ['warn', ...NAMING, BOOLEAN_NAMING],
          },
        },
      ]
    : []),
  // flat/typescript sets tsconfigRootDir from @nx/devkit's workspaceRoot, which follows
  // NX_WORKSPACE_ROOT_PATH when it is set (it can point at another checkout).
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
