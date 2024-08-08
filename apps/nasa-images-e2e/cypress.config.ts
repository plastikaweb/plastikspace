import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';
import { getPreprocessorConfig } from '@jscutlery/cypress-harness/preprocessor-config';

export default defineConfig({
  projectId: 'b47wpf',
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run nasa-images:serve:development',
        production: 'nx run nasa-images:serve:production',
      },
      ciWebServerCommand: 'nx run nasa-images:serve-static',
    }),
    ...getPreprocessorConfig(),
    testIsolation: false,
    experimentalStudio: true,
    baseUrl: 'http://localhost:4201',
  },
});
