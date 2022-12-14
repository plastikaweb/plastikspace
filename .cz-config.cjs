module.exports = {
  types: [
    { value: 'feat', name: 'feat: A new feature' },
    { value: 'fix', name: 'fix: A bug fix' },
    { value: 'docs', name: 'docs: Documentation only changes' },
    {
      value: 'test',
      name: 'test: Adding missing tests or correcting existing tests',
    },
    {
      value: 'refactor',
      name: 'refactor: A code change that neither fixes a bug nor adds a feature',
    },
    { value: 'perf', name: 'perf: A code change that improves performance' },
    {
      value: 'style',
      name: 'style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    },
    {
      value: 'build',
      name: 'build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
    },
    {
      value: 'ci',
      name: 'ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
    },
    {
      value: 'chore',
      name: 'chore: Changes to the build process, or auxiliary tools and libraries such as documentation generation',
    },
    { value: 'revert', name: 'revert: Revert to a commit' },
  ],
  scopes: ['nasa-images'],
  allowCustomScopes: true,
  allowTicketNumber: true,
  isTicketNumberRequired: false,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['footer', 'breaking'],
};
