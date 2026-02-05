const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html', 'lcov', 'text', 'cobertura', 'json-summary'],
  coverageDirectory: '../../coverage',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
};
