import cypress from 'eslint-plugin-cypress';
import * as espree from 'espree';
import baseConfig from '../../eslint.config.mjs';

export default [
  // eslintrc applied the Cypress preset before the root config.
  cypress.configs.recommended,
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx', 'cypress/**/*.js'],
    // Override or add rules here
    rules: {},
    languageOptions: {
      parser: espree,
    },
  },
  {
    ignores: ['**/vitest.config.*.timestamp*'],
  },
];
