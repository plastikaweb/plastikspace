import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { getAllHarnesses } from '@jscutlery/cypress-harness';

import { ChainableHarness } from '@jscutlery/cypress-harness/src/lib/internals';
import { pageTitle } from '../support/app.po';

type NasaImagesTestCase = {
  case: string;
  fixture: string;
  q: string;
  yearStart: string;
  yearEnd: string;
  noResults: string | null;
};

const noResultsMessage = () => cy.getEl('search-no-results-message');
const submitBtn = () => cy.getEl('submit-button');

describe('nasa-images search page', () => {
  beforeEach(() => {
    cy.visit('/search');
  });

  it('should have a head title', () => {
    cy.title().should('eq', 'Nasa Images - search');
  });

  it('should have a page title', () => {
    pageTitle().contains('Search images');
  });

  it('should have an initial message with instructions to search images', () => {
    noResultsMessage().contains('Use the filter to find related NASA pictures.');
  });

  context('filter form', () => {
    let inputs: ChainableHarness<MatInputHarness[]>;
    let yearPickers: ChainableHarness<MatDatepickerInputHarness[]>;
    let tables: ChainableHarness<MatTableHarness[]>;

    beforeEach(() => {
      inputs = getAllHarnesses(MatInputHarness);
      yearPickers = getAllHarnesses(MatDatepickerInputHarness);
      tables = getAllHarnesses(MatTableHarness);
    });

    context('disabled submit', () => {
      it('should prevent a request by default as form is not valid', () => {
        submitBtn().should('be.disabled');
      });

      it('should prevent a request if form q input is too short', () => {
        cy.setMatInput(inputs, 'p');
        cy.setMatDatePicker(yearPickers, '2020', 0);
        cy.setMatDatePicker(yearPickers, '2021', 1);
        submitBtn().should('be.disabled');
      });
    });

    context('valid request', () => {
      const testCases: NasaImagesTestCase[] = [
        {
          case: 'if form is valid',
          fixture: 'nasa-images',
          q: 'mars',
          yearStart: '2020',
          yearEnd: '2021',
          noResults: null,
        },
        {
          case: 'if form is valid with no results',
          fixture: 'no-nasa-images',
          q: 'abcdefg',
          yearStart: '2019',
          yearEnd: '2021',
          noResults: "We can't find any item matching your search.",
        },
      ];

      for (const testCase of testCases) {
        let collectionLength: number;
        let collectionTotalHits: number;

        it(`should allow a request ${testCase.case}`, () => {
          cy.fixture(testCase.fixture).then(fixture => {
            collectionLength = fixture.collection.items.length || 0;
            collectionTotalHits = fixture.collection.metadata.total_hits || 0;
            cy.intercept('GET', '*', { fixture: testCase.fixture }).as('response');
          });

          cy.setMatInput(inputs, testCase.q);
          cy.setMatDatePicker(yearPickers, testCase.yearStart, 0);
          cy.setMatDatePicker(yearPickers, testCase.yearEnd, 1);

          submitBtn().should('not.be.disabled');
          submitBtn().click({ force: true });

          // location
          cy.location().should(({ search, pathname }) => {
            expect(pathname).to.eq('/search');
            expect(search).to.eq(
              `?q=${testCase.q}&year_start=${testCase.yearStart}&year_end=${testCase.yearEnd}&page=1`
            );
          });

          // api response
          cy.wait('@response').then(({ response }) => {
            expect(response?.statusCode).to.eq(200);
            expect(response?.body.collection.items).to.have.length(collectionLength);
            expect(response?.body.collection.metadata.total_hits).to.eq(collectionTotalHits);
          });

          // header title
          cy.title().should('eq', `Nasa Images - search by "${testCase.q}" (pag. 1)`);

          // table
          tables.should('have.length', 1).then(tables => {
            if (tables.length) {
              tables[0].getRows().then(rows => {
                expect(rows).to.have.length(collectionLength);
              });
            }
          });

          // no results message
          testCase.noResults
            ? noResultsMessage().should('contain', testCase.noResults)
            : noResultsMessage().should('not.exist');
        });
      }
    });

    context('error handling', () => {
      let snackBars: ChainableHarness<MatSnackBarHarness[]>;

      beforeEach(() => {
        snackBars = getAllHarnesses(MatSnackBarHarness);
      });

      it('should show an error message if the request fails', () => {
        cy.intercept('GET', '*', {
          statusCode: 500,
          body: {
            reason: 'Unknown Server Error',
          },
        }).as('response');

        cy.setMatInput(inputs, 'mars');
        cy.setMatDatePicker(yearPickers, '2020', 0);
        cy.setMatDatePicker(yearPickers, '2021', 1);

        submitBtn().should('not.be.disabled');
        submitBtn().click({ force: true });
        // api response
        cy.wait('@response').then(({ response }) => {
          expect(response?.body.reason).to.eq('Unknown Server Error');
          expect(response?.statusCode).to.eq(500);
        });

        // snack bar message
        snackBars.should('have.length', 1).then(snackBars => {
          snackBars[0].getMessage().then(message => {
            expect(message).contains('Unknown Server Error');
          });
        });
      });
    });
  });
});
