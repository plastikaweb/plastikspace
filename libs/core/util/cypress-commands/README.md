# core-util-cypress-commands

- [core-util-cypress-commands](#core-util-cypress-commands)
  - [Description](#description)
  - [Commands](#commands)
    - [getEl](#getel)

## Description

A collection of global core cypress commands to use anywhere.

## Commands

### getEl

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
