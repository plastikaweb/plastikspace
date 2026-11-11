/// <reference types="cypress" />

// ***********************************************
// Custom Cypress commands for eco-admin.
//
// https://on.cypress.io/custom-commands
// ***********************************************

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

/**
 * Where the PocketBase SDK keeps the session (`LocalAuthStore`), as `{ token, record }`.
 */
const AUTH_STORAGE_KEY = 'pocketbase_auth';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      /**
       * Opens a session for a test user of the given role without going through the login screen.
       *
       * The credentials come from `CYPRESS_ECO_ADMIN_<ROLE>_EMAIL` and
       * `CYPRESS_ECO_ADMIN_<ROLE>_PASSWORD` and are never written to the command log.
       * Call it before `cy.visit()`.
       */
      loginAs(role: EcoAdminE2eRole): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAs', (role: EcoAdminE2eRole) => {
  const emailKey = `ECO_ADMIN_${role}_EMAIL`;
  const passwordKey = `ECO_ADMIN_${role}_PASSWORD`;

  cy.log(`loginAs ${role}`);

  // `cy.env()` hands the values to the test without exposing them to the application under test.
  cy.env([emailKey, passwordKey]).then(values => {
    const identity: unknown = values[emailKey];
    const password: unknown = values[passwordKey];

    if (typeof identity !== 'string' || typeof password !== 'string' || !identity || !password) {
      throw new Error(
        `cy.loginAs('${role}') needs CYPRESS_${emailKey} and CYPRESS_${passwordKey}.`
      );
    }

    // `failOnStatusCode: false`: the error Cypress builds for a failed request prints the request
    // body, and the body is the credentials.
    cy.request({
      method: 'POST',
      url: `${LOCAL_POCKETBASE_URL}/api/collections/users/auth-with-password`,
      body: { identity, password },
      failOnStatusCode: false,
      log: false,
    }).then(response => {
      if (response.status !== 200) {
        throw new Error(`cy.loginAs('${role}'): PocketBase answered ${response.status}.`);
      }

      const { token, record } = response.body as { token: string; record: unknown };

      // The runner shares the origin of `baseUrl`, so this is the storage the application reads.
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, record }));
    });
  });
});
