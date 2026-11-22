import * as espree from 'espree';
import globals from 'globals';
import baseConfig from '../../../eslint.config.mjs';

// These scripts run on Node, outside any Angular build. The eco-store config ignores this folder
// and the eco-store-scripts target lints it from here, with the blocks below.
const scriptRules = {
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  'no-undef': 'error',
};

export default [
  ...baseConfig,
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: espree,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: scriptRules,
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      parser: espree,
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: scriptRules,
  },
];
