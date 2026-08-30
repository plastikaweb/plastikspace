describe('eco-admin-e2e', () => {
  beforeEach(() => cy.visit('/'));

  // Placeholder until AP-0 0.7 lands the cms-layout shell and the login screen.
  // The two flows this suite must eventually cover are AMBR-07 (member deletion)
  // and AORD-03 (order state transitions) — see REQUIREMENTS §6.
  it('should bootstrap the admin shell', () => {
    cy.get('eco-admin-root').should('exist');
  });
});
