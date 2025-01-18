import { defineConfig } from 'cypress';

import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run experimental:serve:development',
        production: 'nx run experimental:serve:production',
      },
      ciWebServerCommand: 'nx run experimental:serve-static',
    }),
    baseUrl: 'http://localhost:4300',
  },
});
