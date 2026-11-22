import baseConfig from '../../../../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [
  ...baseConfig,
  // The former .eslintrc.json also extended apps/llecoop's for these two blocks. Importing that
  // config instead would give Nx a dependency of this lib on the app, which is a circular one.
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/no-call-expression': 'off',
    },
  },
  {
    files: ['**/tailwind.config.js'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
  ...nx.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'plastik',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'plastik',
          style: 'kebab-case',
        },
      ],
    },
  },
  ...nx.configs['flat/angular-template'],
  {
    ignores: ['**/vitest.config.*.timestamp*'],
  },
];
