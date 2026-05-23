export default [
  'apps/*/vite.config.mts',
  'libs/**/vite.config.mts',
  {
    test: {
      ssr: {
        noExternal: [/rxfire/, /@firebase/, /@angular\/fire/, /apollo-angular/],
      },
    },
  },
];
