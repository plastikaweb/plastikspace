import baseConfig from '../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [
  ...baseConfig,
  // From the former root .eslintignore. basePath keeps the patterns on this folder whichever way
  // ESLint is run: the lint target passes this file as its config from the workspace root, and a
  // root `eslint` looks it up from each file. scripts/ has a config and a lint target of its own.
  { basePath: import.meta.dirname, ignores: ['pocketbase', 'scripts'] },
  ...nx.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'eco',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'eco',
          style: 'kebab-case',
        },
      ],
    },
  },
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/tailwind.config.js'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
  {
    ignores: ['**/vitest.config.*.timestamp*'],
  },
];
