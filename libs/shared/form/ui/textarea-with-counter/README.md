# textarea-with-counter

- [textarea-with-counter](#textarea-with-counter)
  - [Description](#description)
  - [HTML element](#html-element)
  - [How to use with formly](#how-to-use-with-formly)
  - [Running unit tests](#running-unit-tests)

## Description

A textarea formly type with a counter to show the number of characters typed.

## HTML element

`<plastik-textarea-with-counter-type>`

## How to use with formly

Use a `FormlyFieldConfig` with the `textarea-with-counter` type:

```typescript
const formly: FormlyFieldConfig = {
  key: 'description',
  type: 'textarea',
  props: {
    label: 'Description',
    required: true,
    rows: 5,
    maxLength: 100,
  },
};
```

## Running unit tests

Run `nx test textarea-with-counter` to execute the unit tests.
