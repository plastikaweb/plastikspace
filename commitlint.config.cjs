module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'never', 100],
    'body-max-length': [2, 'never', 500],
    'body-max-line-length': [2, 'never', 500],
    'subject-case': [2, 'never', ['camel-case', 'pascal-case', 'snake-case', 'start-case']],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'revert',
        'perf',
        'ci',
        'chore',
        'build',
      ],
    ],
  },
};
