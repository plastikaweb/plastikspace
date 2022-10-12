module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-length': [2, 'never', 400],
    'subject-case': [2, 'never', ['camel-case', 'pascal-case', 'snake-case', 'start-case']],
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert', 'perf', 'ci', 'chore', 'build']],
  },
};
