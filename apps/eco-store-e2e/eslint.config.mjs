import cypress from 'eslint-plugin-cypress';
import baseConfig from '../../eslint.config.mjs';

export default [
  // eslintrc applied the Cypress preset before the root config.
  cypress.configs.recommended,
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    ignores: ['**/vitest.config.*.timestamp*'],
  },
];
