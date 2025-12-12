# @plastik/core/cypress-commands

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Cypress](https://img.shields.io/badge/cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)

- [@plastik/core/cypress-commands](#plastikcorecypress-commands)
  - [Description](#description)
  - [Commands](#commands)
    - [Selectors](#selectors)
      - [`getEl`](#getel)
    - [Material](#material)
      - [`setMatInput`](#setmatinput)
      - [`setMatDatePicker`](#setmatdatepicker)
  - [Resources](#resources)

## Description

A collection of **global Core Cypress commands** to use anywhere in the workspace. It enforces best practices for selectors and interacting with Angular Material components.

## Commands

### Selectors

#### `getEl`

Cypress HTML selectors should be agnostic to changes, style classes, or tag names. We use the `data-test` attribute to ensure stability.

**HTML:**

```html
<header data-test="layout-header"></header>
```

**Test:**

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

Uses [Material CDK Component Test Harnesses](https://material.angular.io/cdk/test-harnesses/overview) to robustly interact with Angular Material components.

#### `setMatInput`

Sets a value for a Material Input Component.

```typescript
import { MatInputHarness } from '@angular/material/input/testing';
import { getAllHarnesses } from '@jscutlery/cypress-harness';

// set the value 'test@test.com' into the second input component
cy.setMatInput(getAllHarnesses(MatInputHarness), 'test@test.com', 1);
```

#### `setMatDatePicker`

Sets a value for a Material Datepicker Component.

```typescript
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { getAllHarnesses } from '@jscutlery/cypress-harness';

// set the value '2021' into the first datepicker component
cy.setMatDatePicker(getAllHarnesses(MatDatepickerInputHarness), '2021', 0);
```

## Resources

- [Material CDK Component Test Harnesses](https://material.angular.io/cdk/test-harnesses/overview)
- [Cypress Harness](https://github.com/jscutlery/devkit/tree/main/packages/cypress-harness)
- [Share Cypress Commands in an Nx Workspace](https://www.cypress.io/blog/2022/04/13/share-cypress-commands-in-an-nx-workspace/)
- [@nx/cypress](https://nx.dev/packages/cypress)
