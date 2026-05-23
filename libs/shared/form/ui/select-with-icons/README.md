# shared-form-ui-select-with-icons

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular%20material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)
![Formly](https://img.shields.io/badge/formly-blue?style=for-the-badge)

- [shared-form-ui-select-with-icons](#shared-form-ui-select-with-icons)
  - [Description](#description)
  - [SharedFormUiSelectWithIconsComponent (`select-with-icons`)](#sharedformuiselectwithiconscomponent-select-with-icons)
    - [Features](#features)
    - [Formly Configuration](#formly-configuration)
  - [Running unit tests](#running-unit-tests)

## Description

A reusable Formly field type for displaying a select dropdown with icons and semantic status-aware styling.

## SharedFormUiSelectWithIconsComponent (`select-with-icons`)

This component provides a Material Select field that renders icons alongside labels in both the trigger and the option list. It also supports semantic types for color-coding options based on status.

### Features

- **Icon Integration**: Displays Material Icons for each option.
- **Semantic Styling**: Applies status-aware colors (success, warning, error, etc.) to the trigger and options.
- **Formly Integration**: Registered as a `select-with-icons` type for easy use in Formly schemas.
- **Performance**: Built using Angular Signals and `OnPush` change detection.

### Formly Configuration

To use this field type, add it to your Formly field configuration:

```typescript
{
  key: 'status',
  type: 'select-with-icons',
  props: {
    label: 'Status',
    options: [
      { value: 'PENDING', label: 'Pending', icon: 'pending', type: 'warning' },
      { value: 'DELIVERED', label: 'Delivered', icon: 'check_circle', type: 'success' },
      { value: 'CANCELLED', label: 'Cancelled', icon: 'error', type: 'error' },
    ],
  },
}
```

## Running unit tests

Run `nx test shared-form-ui-select-with-icons` to execute the unit tests via [Vitest](https://vitest.dev/).
