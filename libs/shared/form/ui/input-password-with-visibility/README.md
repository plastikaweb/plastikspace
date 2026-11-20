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

The input is named once. With `props.label` the `<mat-label>` of the form field names it; without a label, or with `props.hideLabel`,
the type adds a visually hidden `<label>` (`common.form.password`).

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

  /**
   * The `autocomplete` attribute of the input, e.g. `current-password` or `new-password`.
   * @default 'off'
   */
  autocomplete?: string;
}
```

The `name` of the field config, when set, becomes the `name` attribute of the input; without it the input has none.

The toggle is a 24px icon button by default. In the eco apps (eco-store and eco-admin) it is a 44px button with an 18px icon:
the field style they share sets it, in `libs/core/styles/util/material/src/_core_input_material.scss`.
Another application overrides the Material tokens on the type's element in the same way:

```scss
plastik-input-password-with-visibility-type {
  @include mat.icon-button-overrides(
    (
      state-layer-size: 44px,
    )
  );
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
