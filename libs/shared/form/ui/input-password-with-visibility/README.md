# input-password-with-visibility

## Table of Contents

- [input-password-with-visibility](#input-password-with-visibility)
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

A formly controller to pick up a password with a visibility toggle. It provides a password input field with a button to show/hide the password content.

## Usage

### HTML Element

`<plastik-input-password-with-visibility-type>`

### Module Setup

To use the `input-password-with-visibility` type, you need to import the following modules in your component:

- `PasswordWithVisibilityFormlyModule`
- [SharedFormFeatureModule](../../feature/README.md)

### Formly Configuration

The component type name is: `password-with-visibility`

### Basic Example

```typescript
const formly: FormlyFieldConfig = {
  key: 'password',
  type: 'password-with-visibility',
  props: {
    label: 'Password',
    required: true,
    minLength: 8,
    maxLength: 12,
  },
};
```

## API Reference

### Props Interface

```typescript
interface PasswordWithVisibilityProps extends FormlyFieldProps {
  /**
   * Minimum length of the password
   * @default 8
   */
  minLength: number;

  /**
   * Maximum length of the password
   * @default 12
   */
  maxLength: number;
}
```

### Return Value

Returns a string containing the password value.

## Troubleshooting

### Common Issues

1. Password visibility toggle not working: Ensure the required modules are properly imported
2. Validation not working: Check if minLength and maxLength are properly set
3. Form submission issues: Verify the form is properly initialized

## Running unit tests

Run `nx test input-password-with-visibility` to execute the unit tests.
