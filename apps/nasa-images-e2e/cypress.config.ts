import { defineConfig } from 'cypress';

import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run nasa-images:serve:development',
        production: 'nx run nasa-images:serve:production',
      },
      ciWebServerCommand: 'nx run nasa-images:serve-static',
    }),
    baseUrl: 'http://localhost:4201',
    setupNodeEvents(on, config) {
      config.defaultCommandTimeout = 120000;
      config.requestTimeout = 120000;
      return config;
    },
  },
});
