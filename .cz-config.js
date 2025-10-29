const base = require('./tsconfig.base.json');
const scopes =
  base.compilerOptions && base.compilerOptions.paths
    ? Object.keys(base.compilerOptions.paths)
        .map(path => path.split('@plastik/')[1])
        .filter(Boolean)
    : [];

module.exports = {
  types: [
    { value: 'feat', name: '✨ feat : A new feature' },
    { value: 'fix', name: '🐞 fix : A bug fix' },
    { value: 'docs', name: '📗 docs : Documentation only changes' },
    {
      value: 'test',
      name: '🧪 test : Adding missing tests or correcting existing tests',
    },
    {
      value: 'refactor',
      name: '🛠  refactor : A code change that neither fixes a bug nor adds a feature',
    },
    { value: 'perf', name: '🏆 perf : A code change that improves performance' },
    {
      value: 'style',
      name: '🎨 style : Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    },
    {
      value: 'build',
      name: '🏛  build : Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
    },
    {
      value: 'ci',
      name: '🛡  ci : Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
    },
    {
      value: 'chore',
      name: '🧠 chore : Changes to the build process, or auxiliary tools and libraries such as documentation generation',
    },
    { value: 'revert', name: '⏪ revert : Revert to a commit' },
  ],
  messages: {
    type: "Select the type of change that you're committing:",
    scope: 'Denote the SCOPE of this change (optional):',
    customScope:
      'Add a custom descriptive SCOPE that does not exist in the list. E.g.: "index.html" | "api" | "husky" | "header":',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },
  scopes: ['nasa-images', 'experimental', 'llecoop', 'plastikaweb', 'eco-store', ...scopes],
  allowCustomScopes: true,
  scopeOverrides: {
    test: [{ name: 'e2e' }, { name: 'unit' }],
  },
  allowTicketNumber: true,
  isTicketNumberRequired: false,
  ticketNumberPrefix: '#',
  ticketNumberRegExp: '\\d{1,5}',
  appendIssueFromBranchName: true,
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
  skipQuestions: [],
};
