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
  datePickers.then(pickers => {
    pickers[index].openCalendar();
    pickers[index].setValue(date);
    pickers[index]
      .getCalendar()
      .then(calendar =>
        calendar.selectCell({ text: date }).then(() => pickers[index].closeCalendar())
      );
  });
});
