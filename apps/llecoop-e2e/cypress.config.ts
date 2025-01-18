import { defineConfig } from 'cypress';

import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run llecoop:serve:development',
        production: 'nx run llecoop:serve:production',
      },
      ciWebServerCommand: 'nx run llecoop:serve-static',
    }),
    baseUrl: 'http://localhost:4203',
    setupNodeEvents(on, config) {
      config.defaultCommandTimeout = 120000;
      config.requestTimeout = 120000;
      return config;
    },
  },
});
