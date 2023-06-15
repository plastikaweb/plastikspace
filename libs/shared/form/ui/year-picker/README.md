# shared-form-ui-year-picker / plastik-shared-form-ui-year-picker-type

## Description

A form controller to pick up a date as a single year (YYYY).

## HTML elements

`<plastik-shared-form-ui-year-picker>`

## Inputs

| Name      | Type    | Description                                                                 | Default |
| --------- | ------- | --------------------------------------------------------------------------- | ------- |
| `touchUi` | boolean | sets the view of the picker as an overflow dialog (valid for mobile screen) | false   |

## How to use with formly

We use the `SharedFormUiYearPickerTypeComponent` that is set as a `year-picker` formly type in order to set the input type in any formly configuration:

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

## Running unit tests

Run `nx test shared-form-ui-year-picker` to execute the unit tests.
