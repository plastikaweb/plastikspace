# core-util-cypress-commands

- [core-util-cypress-commands](#core-util-cypress-commands)
  - [Description](#description)
  - [Commands](#commands)
    - [Selectors](#selectors)
      - [getEl](#getel)
    - [Material](#material)
      - [setMatInput](#setmatinput)
      - [setMatDatePicker](#setmatdatepicker)
  - [Useful links](#useful-links)

## Description

A collection of global core cypress commands to use anywhere.

## Commands

### Selectors

#### getEl

Cypress HTML selectors should be agnostic to changes, style classes, or tag names.

So to prevent any possible unwanted change on any cypress selectors, we use specific test selectors with the attribute name of `data-test`:

```html
<header data-test="layout-header"></header>
```

Use to get a specific cypress element by its attribute like this:

```typescript
const header = () => cy.getEl('layout-header');

describe('layout', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('header', () => {
    it('should have a header title', () => {
      header().contains('My Site');
    });
  });
});
```

### Material

We are using [Material CDK Component Test Harnesses](https://material.angular.io/cdk/test-harnesses/overview) in order to set values for Angular Material Components or control their behavior.

#### setMatInput

Sets a value for a Material Input Component.

```typescript
import { MatInputHarness } from '@angular/material/input/testing';
import { getAllHarnesses } from '@jscutlery/cypress-harness';

// set the value 'test@test.com' into the second input component
cy.setMatInput(getAllHarnesses(MatInputHarness), 'test@test.com', 1);
```

#### setMatDatePicker

Sets a value for a Material Datepicker Component.

```typescript
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { getAllHarnesses } from '@jscutlery/cypress-harness';

// set the value '2021' into the first datepicker component
cy.setMatDatePicker(getAllHarnesses(MatDatepickerInputHarness), '2021', 0);
```

## Useful links

- [Material CDK Component Test Harnesses](https://material.angular.io/cdk/test-harnesses/overview)
- [Cypress Harness](https://github.com/jscutlery/devkit/tree/main/packages/cypress-harness)
- [Share Cypress Commands in an Nx Workspace](https://www.cypress.io/blog/2022/04/13/share-cypress-commands-in-an-nx-workspace/)
- [@nx/cypress](https://nx.dev/packages/cypress)
