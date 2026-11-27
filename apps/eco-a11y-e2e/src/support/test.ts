import { test as base, expect, type Page } from '@playwright/test';
import { authToken, installPocketBase, type PocketBaseLog } from './pocketbase';
import { MEMBER, type PocketBaseRecord } from './records';

/** eco-store, opened as the tenant El Llevat. */
export const STORE = 'http://el-llevat.localhost:4300';

/** eco-admin. */
export const ADMIN_APP = 'http://localhost:4304';

interface Options {
  /** Who PocketBase signs in, by the login screen or by the session the test starts with. */
  account: PocketBaseRecord;
  /** Starts the test with `account` already signed in. */
  isSignedIn: boolean;
  /** Leaves the PWA install sheet that a first visit shows. */
  hasPwaSheet: boolean;
}

interface Fixtures {
  /** The PocketBase requests the page made, one line each. */
  pocketBase: PocketBaseLog;
}

/**
 * The Playwright `test` with PocketBase answered from the records on every test. The requests the
 * records did not cover are listed in the report as `fixture gaps`.
 */
export const test = base.extend<Options & Fixtures>({
  account: [MEMBER, { option: true }],
  isSignedIn: [false, { option: true }],
  hasPwaSheet: [false, { option: true }],
  pocketBase: [
    async ({ context, account, isSignedIn, hasPwaSheet }, use, testInfo) => {
      const session = isSignedIn ? { token: authToken(account), record: account } : null;

      await context.addInitScript(
        ({ isPwaSheetShown, auth }) => {
          if (!isPwaSheetShown) localStorage.setItem('eco_pwa_dismissed', String(Date.now()));
          if (auth) localStorage.setItem('pocketbase_auth', JSON.stringify(auth));
        },
        { isPwaSheetShown: hasPwaSheet, auth: session }
      );
      const log = await installPocketBase(context, account);

      await use(log);

      const gaps = [...new Set(log.filter(line => /^(4\d\d|BLOCKED)/.test(line)))];

      if (gaps.length)
        testInfo.annotations.push({ type: 'fixture gaps', description: gaps.join('\n') });
    },
    { auto: true },
  ],
});

/**
 * Signs `user` in from the page it is on, as the login screen would.
 * The session goes where the PocketBase SDK keeps it, and the next navigation reads it.
 * @param { Page } page - The page of the test.
 * @param { PocketBaseRecord } user - Who signs in.
 */
export async function startSession(page: Page, user: PocketBaseRecord): Promise<void> {
  await page.evaluate(session => localStorage.setItem('pocketbase_auth', JSON.stringify(session)), {
    token: authToken(user),
    record: user,
  });
}

export { expect };
