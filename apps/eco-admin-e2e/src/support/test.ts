import { test as base, expect } from '@playwright/test';

/**
 * The roles a test can open a session with. `PARTNER` is a storefront member: eco-admin refuses
 * it, and a test needs it to prove that.
 */
export type EcoAdminE2eRole = 'TENANT_ADMIN' | 'GLOBAL_ADMIN' | 'PARTNER';

/**
 * The only PocketBase these tests may sign in to. It is a constant on purpose: no environment
 * variable can point a test login at staging or production.
 */
const LOCAL_POCKETBASE_URL = 'http://127.0.0.1:8090';

/** Where the PocketBase SDK keeps the session (`LocalAuthStore`), as `{ token, record }`. */
const AUTH_STORAGE_KEY = 'pocketbase_auth';

interface Options {
  /**
   * Starts the test signed in as a test user of this role, without going through the login
   * screen: `test.use({ signedInAs: 'TENANT_ADMIN' })`. Unset, the test starts with no session.
   */
  signedInAs: EcoAdminE2eRole | undefined;
}

/**
 * Signs a test user of `role` in to the local PocketBase.
 * The credentials come from `ECO_ADMIN_<ROLE>_EMAIL` and `ECO_ADMIN_<ROLE>_PASSWORD`. The request
 * goes through Node's `fetch`, not Playwright's, so neither the trace nor the report records them.
 * @param { EcoAdminE2eRole } role - The role of the test user.
 * @returns { Promise<string> } The session as the PocketBase SDK stores it.
 */
async function signIn(role: EcoAdminE2eRole): Promise<string> {
  const emailKey = `ECO_ADMIN_${role}_EMAIL`;
  const passwordKey = `ECO_ADMIN_${role}_PASSWORD`;
  const identity = process.env[emailKey];
  const password = process.env[passwordKey];

  if (!identity || !password) {
    throw new Error(`signedInAs '${role}' needs ${emailKey} and ${passwordKey}.`);
  }

  const response = await fetch(`${LOCAL_POCKETBASE_URL}/api/collections/users/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity, password }),
  }).catch((error: unknown) => {
    throw new Error(`signedInAs '${role}': no PocketBase answers on ${LOCAL_POCKETBASE_URL}.`, {
      cause: error,
    });
  });

  if (!response.ok) {
    throw new Error(`signedInAs '${role}': PocketBase answered ${response.status}.`);
  }

  const { token, record } = (await response.json()) as { token: string; record: unknown };

  return JSON.stringify({ token, record });
}

/**
 * The Playwright `test` of eco-admin. With `signedInAs`, the browser context starts with the
 * session already in the storage of the app's origin, so the first `page.goto()` finds it.
 */
export const test = base.extend<Options>({
  signedInAs: [undefined, { option: true }],
  storageState: async ({ signedInAs, baseURL, storageState }, use) => {
    if (!signedInAs || !baseURL) {
      await use(storageState);

      return;
    }

    const session = await signIn(signedInAs);

    await use({
      cookies: [],
      origins: [
        {
          origin: new URL(baseURL).origin,
          localStorage: [{ name: AUTH_STORAGE_KEY, value: session }],
        },
      ],
    });
  },
});

export { expect };
