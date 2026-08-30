import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'yarn nx run eco-admin:serve',
        production: 'yarn nx run eco-admin:serve-static',
      },
      ciWebServerCommand: 'yarn nx run eco-admin:serve-static',
      ciBaseUrl: 'http://localhost:4204',
    }),
    baseUrl: 'http://localhost:4204',
  },
});
