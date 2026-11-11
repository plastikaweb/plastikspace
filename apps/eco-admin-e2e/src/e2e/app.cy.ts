describe('eco-admin-e2e', () => {
  // The two flows this suite must eventually cover are AMBR-07 (member deletion)
  // and AORD-03 (order state transitions) — see REQUIREMENTS §6. They need the views
  // behind the shell; until then the suite checks the door.
  it('sends a visitor without a session to the login screen', () => {
    cy.visit('/');

    cy.location('pathname').should('eq', '/accedir');
    cy.get('#eco-admin-login-email').should('be.visible');
    cy.get('#eco-admin-login-password').should('have.attr', 'type', 'password');
  });
});
