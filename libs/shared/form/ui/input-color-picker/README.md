# input-color-picker

## Description

A formly controller to pick up a color as a string. It t uses the [ngx-colors](https://ngx-colors.web.app/overview) library.

## HTML element

`<plastik-input-color-picker-type>`

## How to use with formly

Formly props:

```typescript
interface ColorPickerProps extends FormlyFieldProps {
  acceptLabel: string;
  cancelLabel: string;
  colorPalette: string[];
  hideColorPicker: boolean;
  hideTextInput: boolean;
}
```

Use a `FormlyFieldConfig` with the `input-color-picker` type:

```typescript
const formly: FormlyFieldConfig = {
  key: 'color',
  type: 'input-color-picker',
  props: {
    label: 'Color',
    required: true,
    colorPalette: [
      '#000000',
      '#FFFFFF',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
      '#00FFFF',
      '#FF00FF',
    ],
  },
};
```

## Useful links

- [ngx-colors](https://ngx-colors.web.app/overview)

## Running unit tests

Run `nx test input-color-picker` to execute the unit tests.
