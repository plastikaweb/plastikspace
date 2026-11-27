import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig } from '@playwright/test';

/**
 * The accessibility suite of eco-store and eco-admin (META-40): each screen in the state a user
 * sees it, audited by axe with the WCAG 2.2 AA rules, plus the 2.2 criteria no rule covers.
 *
 * It serves the production builds already in `dist/` (the `e2e` target builds them first) and
 * answers PocketBase from `src/support/records.ts`, so it needs no PocketBase at all. It runs in
 * the Chrome installed on the machine (`channel: 'chrome'`): no Playwright browser download.
 */
const preset = nxE2EPreset(import.meta.dirname, { testDir: './src', openHtmlReport: 'never' });

export default defineConfig({
  ...preset,
  // The list for the terminal, then the preset's HTML report (dist/.playwright/…/playwright-report),
  // which holds each test's axe results and the screenshot of a failure. Workers stay at
  // Playwright's default, half the cores: on 4 cores, 4 workers ran 10 s slower than 2.
  reporter: [['list'], ...preset.reporter],
  use: {
    channel: 'chrome',
    locale: 'ca-ES',
    timezoneId: 'Europe/Madrid',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      // eco-store is an SSR app: its client-only entry is `index.csr.html`. The tenant comes from
      // the first label of the host, so the tests open it as `el-llevat.localhost`.
      command:
        'yarn angular-http-server --path dist/apps/eco-store/browser -p 4300 --rootFile index.csr.html --silent',
      url: 'http://127.0.0.1:4300',
      reuseExistingServer: !process.env['CI'],
      cwd: workspaceRoot,
    },
    {
      command: 'yarn angular-http-server --path dist/apps/eco-admin/browser -p 4304 --silent',
      url: 'http://127.0.0.1:4304',
      reuseExistingServer: !process.env['CI'],
      cwd: workspaceRoot,
    },
  ],
  projects: [
    { name: 'mobile', use: { viewport: { width: 320, height: 640 }, colorScheme: 'light' } },
    { name: 'mobile-dark', use: { viewport: { width: 320, height: 640 }, colorScheme: 'dark' } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 }, colorScheme: 'light' } },
  ],
});
