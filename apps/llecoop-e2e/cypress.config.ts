import { defineConfig } from 'cypress';

import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'npx nx run llecoop:serve:development',
        production: 'npx nx run llecoop:serve:production',
        ci: 'npx nx run llecoop:serve-static',
      },
      ciWebServerCommand: 'npx nx run llecoop:serve-static',
    }),
    baseUrl: 'http://localhost:4203',
    setupNodeEvents(on, config) {
      config.defaultCommandTimeout = 120000;
      config.requestTimeout = 120000;

      return config;
    },
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
