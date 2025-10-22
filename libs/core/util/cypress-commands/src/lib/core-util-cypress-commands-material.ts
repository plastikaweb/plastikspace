import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { ChainableHarness } from '@jscutlery/cypress-harness/src/lib/internals';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      setMatInput(inputs: ChainableHarness<MatInputHarness[]>, text: string, index?: number): void;
      setMatDatePicker(
        datePickers: ChainableHarness<MatDatepickerInputHarness[]>,
        date: string,
        index?: number
      ): void;
    }
  }
}

Cypress.Commands.add('setMatInput', (inputs, text, index = 0) => {
  inputs.then(inputs => inputs[index].setValue(text));
});

Cypress.Commands.add('setMatDatePicker', (datePickers, date, index = 0) => {
  datePickers.then(async pickers => {
    const picker = pickers[index];

    // Get the native input element
    const inputElement = await picker.host().then(host => host.getAttribute('id'));

    // Click the input to open the calendar
    cy.get(`#${inputElement}`).click({ force: true });

    // Click the year button
    cy.get('.mat-calendar').find('button').contains(date).click();

    // Wait for calendar to close
    await picker.closeCalendar();
  });
});
