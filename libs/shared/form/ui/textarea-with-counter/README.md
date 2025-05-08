# textarea-with-counter

## Table of Contents

- [textarea-with-counter](#textarea-with-counter)
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

A formly controller that provides a textarea input with a character counter. It displays the current number of characters and enforces a maximum length limit.

## Usage

### HTML Element

`<plastik-textarea-with-counter-type>`

### Module Setup

To use the `textarea-with-counter` type, you need to import the following modules in your component:

- `TextareaWithCounterFormlyModule`
- [SharedFormFeatureModule](../../feature/README.md)

### Formly Configuration

The component type name is: `textarea-with-counter`

### Basic Example

```typescript
const formly: FormlyFieldConfig = {
  key: 'description',
  type: 'textarea-with-counter',
  props: {
    label: 'Description',
    required: true,
    rows: 5,
    maxLength: 100,
  },
};
```

## API Reference

### Props Interface

```typescript
interface TextareaWithCounterProps extends FormlyFieldProps {
  /**
   * Number of visible text rows
   * @default 3
   */
  rows: number;

  /**
   * Maximum number of characters allowed
   * @default 100
   */
  maxLength: number;

  /**
   * Placeholder text for the textarea
   * @default ""
   */
  placeholder?: string;
}
```

### Return Value

Returns a string containing the textarea content.

## Troubleshooting

### Common Issues

1. Counter not updating: Check if maxLength is properly set
2. Textarea size issues: Adjust the rows property
3. Form validation errors: Ensure required and maxLength properties are correctly configured

## Running unit tests

Run `nx test textarea-with-counter` to execute the unit tests.
