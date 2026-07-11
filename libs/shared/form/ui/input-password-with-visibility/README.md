# input-password-with-visibility

## Table of Contents

- [input-password-with-visibility](#input-password-with-visibility)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Usage](#usage)
    - [HTML Element](#html-element)
    - [Provider Setup](#provider-setup)
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

### Provider Setup

To use the `input-password-with-visibility` type, you need to add the following to your component or route providers:

- `providePasswordWithVisibilityFormly()`

This provider handles the registration of the Formly field type and its associated validators (`password` and `passwordMatch`).

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

  /**
   * Select the (masked) input content whenever the field receives focus,
   * so the user can retype it straight away — useful when re-focusing the
   * field after a server-side rejection (e.g. wrong current password).
   * @default false
   */
  selectOnFocus?: boolean;
}
```

### Return Value

Returns a string containing the password value.

## Troubleshooting

### Common Issues

1. **Password visibility toggle not working**: Ensure `providePasswordWithVisibilityFormly()` is properly included in the providers.
2. **Validation not working**: Check if `minLength` and `maxLength` are properly set.
3. **Translation missing**: The validators use `registerAuthValidatorsTranslateExtension` internally via the provider. Ensure your i18n files have the required keys.

## Running unit tests

Run `nx test input-password-with-visibility` to execute the unit tests via Vitest.
