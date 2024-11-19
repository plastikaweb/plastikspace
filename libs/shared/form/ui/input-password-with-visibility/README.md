# input-password-with-visibility

- [input-password-with-visibility](#input-password-with-visibility)
  - [Description](#description)
  - [HTML element](#html-element)
  - [How to use with formly](#how-to-use-with-formly)
  - [Running unit tests](#running-unit-tests)

## Description

A formly controller to pick up a password with a visibility toggle.

## HTML element

`<plastik-input-password-with-visibility-type>`

## How to use with formly

```typescript
const formly: FormlyFieldConfig = {
  key: 'password',
  type: 'password-with-visibility',
  props: {
    type: 'password',
    label: 'Password',
    required: true,
    minLength: 8,
    maxLength: 12,
  },
};
```

## Running unit tests

Run `nx test input-password-with-visibility` to execute the unit tests.
