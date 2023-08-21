export const titleHeader = () => cy.getEl('layout-title');
export const toggleSidenavButton = () => cy.getEl('toggle-sidenav-button');
export const toggleSidenavButtonIcon = () => toggleSidenavButton().children('mat-icon');
export const githubButton = () => cy.getEl('github-button');
export const githubButtonIcon = () => githubButton().children('svg-icon');

export const sidenav = () => cy.getEl('sidenav');
export const sidenavList = () => cy.getEl('sidenav-list');
export const sidenavListItems = () => sidenavList().children('a');

export const footer = () => cy.getEl('layout-footer');
export const footerIcon = () => footer().find('svg-icon');
export const footerLink = () => footer().find('a');

describe('nasa-images layout', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('header', () => {
    it('should have a header with a title', () => {
      titleHeader().contains('NASA Images Search');
    });

    it('should have a toggle sidenav button that controls sidenav visibility', () => {
      toggleSidenavButton().click();
      sidenav().should('not.be.visible');
      toggleSidenavButtonIcon().contains('menu');

      toggleSidenavButton().click();
      sidenav().should('be.visible');
      toggleSidenavButtonIcon().contains('close');
    });

    it('should have a icon button link to the github repository', () => {
      githubButton().should('have.attr', 'href', 'https://github.com/plastikaweb/plastikspace/tree/develop/apps/nasa-images/README.md');
      githubButtonIcon().should('have.attr', 'ng-reflect-src', 'assets/svg/github.svg');
    });
  });

  describe('sidenav', () => {
    it('should have a sidenav with a menu with 2 items', () => {
      sidenavListItems().should('have.length', 2);
    });

    it('should show sidenav by default', () => {
      sidenav().should('be.visible');
    });

    it('should toggle sidenav visibility on hamburger button click', () => {
      toggleSidenavButton().click();
      sidenav().should('not.be.visible');

      toggleSidenavButton().click();
      sidenav().should('be.visible');
    });

    describe('on small screens', () => {
      beforeEach(() => {
        cy.viewport('iphone-6');
      });

      it('should hide sidenav by default', () => {
        sidenav().should('not.be.visible');
      });
    });
  });

  describe('footer', () => {
    it('should have elements', () => {
      footer().contains('© 2006-');
      footer().contains('Carlos Matheu | FrontEnd Freelancer.');
      footerIcon().should('have.attr', 'ng-reflect-src', '/assets/svg/plastikaweb.svg');
      footerLink().should('have.attr', 'href', 'https://www.plastikaweb.com');
    });
  });
});
