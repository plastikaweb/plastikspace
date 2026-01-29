export default {
  displayName: 'plastikaweb',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/plastikaweb',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
    '^.+\\.astro$': 'jest-transform-stub',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [],
  moduleFileExtensions: ['ts', 'mjs', 'js', 'html', 'astro'],
};
