import { getReadyUrl, workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig } from '@playwright/test';
import { join } from 'node:path';

/**
 * The end-to-end suite of eco-admin: the flows that need the real local PocketBase on :8090, such
 * as AMBR-07 (member deletion) and AORD-03 (order transitions), REQUIREMENTS §6. Its accessibility
 * checks live in `apps/eco-a11y-e2e`, which answers PocketBase from fixtures instead.
 *
 * It starts `eco-admin:serve` (development configuration, local PocketBase) on port 4204, or uses
 * the one already running, and runs in the Chrome installed on the machine (`channel: 'chrome'`).
 * The address is fixed on purpose: no variable can point these tests at a hosted instance.
 */
const baseURL = getReadyUrl('http://localhost:4204');

// The test users' credentials (`src/support/test.ts`) come from the shell or from
// `apps/eco-admin-e2e/.env`, which git ignores. Without the file, the shell alone.
try {
  process.loadEnvFile(join(import.meta.dirname, '.env'));
} catch {
  // No .env file.
}

export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: './src', openHtmlReport: 'never' }),
  use: {
    baseURL,
    channel: 'chrome',
    locale: 'ca-ES',
    timezoneId: 'Europe/Madrid',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'yarn nx run eco-admin:serve',
    url: baseURL,
    reuseExistingServer: true,
    cwd: workspaceRoot,
    // A cold development build of eco-admin takes longer than Playwright's default minute.
    timeout: 180_000,
  },
  // Desktop first (REQUIREMENTS §6).
  projects: [{ name: 'desktop', use: { viewport: { width: 1280, height: 800 } } }],
});
