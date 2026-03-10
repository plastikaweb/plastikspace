export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getEl(identifier: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('getEl', identifier => {
  return cy.get(`[data-test="${identifier}"]`);
});
