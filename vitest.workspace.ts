export default [
  'apps/*/vite.config.mts',
  'libs/**/vite.config.mts',
  {
    test: {
      coverage: {
        reporter: ['text', 'json-summary'],
      },
      ssr: {
        noExternal: [/rxfire/, /@firebase/, /@angular\/fire/, /apollo-angular/],
      },
    },
  },
];
