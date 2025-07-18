// eslint-disable-next-line @nx/enforce-module-boundaries
import json from '../../../../apps/nasa-images/src/assets/json/faqs.json';
import { pageTitle } from '../support/app.po';

const faqItems = () => cy.getEl('faq-item');

describe('nasa-images faqs page', () => {
  beforeEach(() => {
    cy.visit('/faqs');
  });

  it('should have a head title', () => {
    cy.title().should('eq', 'Nasa Images - FAQs');
  });

  it('should have a page title', () => {
    pageTitle().contains('FAQs');
  });

  context('accordion list', () => {
    beforeEach(() => {
      faqItems().first().as('firstFaqItem');
      faqItems().eq(3).as('otherFaqItem');
    });

    it('should have all panels closed state by default', () => {
      faqItems().each($faqItem => {
        cy.wrap($faqItem).find('.mat-expansion-panel-content').should('not.be.visible');
      });
    });

    it('should load all FAQs answers and questions correctly', () => {
      faqItems().each(($faqItem, index) => {
        const question = json[index].question;
        const answer = json[index].answer;

        const sanitizedAnswer = Cypress.$('<div/>').html(answer).text();

        cy.wrap($faqItem).find('[data-test=faq-question]').should('contain', question);
        cy.wrap($faqItem).find('[data-test=faq-answer]').should('contain', sanitizedAnswer);
      });
    });

    it('should open/close a child expansion panel on click', () => {
      cy.get('@otherFaqItem').click();
      cy.get('@otherFaqItem').find('.mat-expansion-panel-content').should('be.visible');
      cy.get('@otherFaqItem').click();
      cy.get('@otherFaqItem').find('.mat-expansion-panel-content').should('not.be.visible');
    });

    it('should close any opened sibling panel on opening another one', () => {
      cy.get('@firstFaqItem').click();
      cy.get('@otherFaqItem').scrollIntoView();
      cy.get('@otherFaqItem').should('be.visible').click();

      cy.get('@otherFaqItem').find('.mat-expansion-panel-content').should('be.visible');
      cy.get('@firstFaqItem').find('.mat-expansion-panel-content').should('not.be.visible');
    });
  });
});
