# year-picker

## Table of Contents

- [year-picker](#year-picker)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Usage](#usage)
    - [HTML Element](#html-element)
    - [Module Setup](#module-setup)
    - [Formly Configuration](#formly-configuration)
    - [Basic Example](#basic-example)
  - [API Reference](#api-reference)
    - [Props Interface](#props-interface)
    - [Return Value](#return-value)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
  - [Running unit tests](#running-unit-tests)

## Description

A form controller to pick up a date as a single year (YYYY).

## Usage

### HTML Element

`<plastik-shared-form-ui-year-picker>`

### Module Setup

To use the `year-picker` type, you need to import the following modules in your component:

- `SharedFormUiYearPickerTypeModule`
- [SharedFormFeatureModule](../../feature/README.md)

### Formly Configuration

The component type name is: `year-picker`

### Basic Example

```typescript
const formly: FormlyFieldConfig = {
  key: 'init-year',
  type: 'year-picker',
  props: {
    label: 'Set year',
    required: true,
    touchUI: false,
  },
};
```

## API Reference

### Props Interface

```typescript
interface YearPickerProps extends FormlyFieldProps {
  /**
   * sets the view of the picker as an overflow dialog (valid for mobile screen)
   * @default false
   */
  touchUI: boolean;

  /**
   * sets the label for the year picker input
   * @default ''
   */
  label: string;
}
```

### Return Value

Returns a string in YYYY format representing the selected year.

## Troubleshooting

### Common Issues

1. Picker dialog not showing on mobile: Check if touchUI is set to true
2. Form validation errors: Ensure required property is correctly set

## Running unit tests

Run `nx test shared-form-ui-year-picker` to execute the unit tests.
