const titleHeader = () => cy.getEl('layout-title');
const toggleSidenavButton = () => cy.getEl('toggle-sidenav-button');
const toggleSidenavButtonIcon = () => toggleSidenavButton().children('mat-icon');
const githubButton = () => cy.getEl('github-button');
const githubButtonIcon = () => githubButton().children('svg-icon');

const sidenav = () => cy.getEl('sidenav');
const sidenavList = () => cy.getEl('sidenav-list');
const sidenavListItems = () => sidenavList().children('mat-list-item');

const footer = () => cy.getEl('layout-footer');
const footerIcon = () => footer().find('svg-icon');
const footerLink = () => footer().find('a');

describe('nasa-images layout', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have a head title', () => {
    cy.title().should('contain', 'Nasa Images');
  });

  context('header', () => {
    it('should have main title', () => {
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
      githubButton().should(
        'have.attr',
        'href',
        'https://github.com/plastikaweb/plastikspace/tree/develop/apps/nasa-images/README.md'
      );
      githubButtonIcon().should('have.attr', 'ng-reflect-src', 'assets/svg/github.svg');
    });
  });

  context('sidenav', () => {
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

    context('on small screens', () => {
      beforeEach(() => {
        cy.viewport('iphone-6');
      });

      it('should hide sidenav by default', () => {
        sidenav().should('not.be.visible');
      });
    });
  });

  context('footer', () => {
    it('should have elements', () => {
      footer().contains('© 2006-');
      footer().contains('Carlos Matheu');
      footerIcon().should('have.attr', 'ng-reflect-src', '/assets/svg/plastikaweb.svg');
      footerLink().should('have.attr', 'href', 'https://www.plastikaweb.com');
    });
  });
});
