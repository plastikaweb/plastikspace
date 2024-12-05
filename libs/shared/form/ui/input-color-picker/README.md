# input-color-picker

## Table of Contents

- [input-color-picker](#input-color-picker)
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
  - [Useful links](#useful-links)

## Description

A formly controller to pick up a color as a string. It uses the [ngx-colors](https://ngx-colors.web.app/overview) library (v3.x.x or higher).

## Usage

### HTML Element

`<plastik-input-color-picker-type>`

### Module Setup

To use the `input-color-picker` type, you need to import the following modules in your component:

- `ColorPickerFormlyModule`
- [SharedFormFeatureModule](../../feature/README.md)

### Formly Configuration

The component type name is: `input-color-picker`

### Basic Example

```typescript
const formly: FormlyFieldConfig = {
  key: 'color',
  type: 'input-color-picker',
  props: {
    label: 'Color',
    required: true,
    colorPalette: ['#000000', '#FFFFFF'],
  },
};
```

## API Reference

### Props Interface

```typescript
interface ColorPickerProps extends FormlyFieldProps {
  /**
   * Label for the accept button
   * @default "Accept"
   */
  acceptLabel: string;

  /**
   * Label for the cancel button
   * @default "Cancel"
   */
  cancelLabel: string;

  /**
   * Array of predefined colors to show in the palette
   * @default []
   */
  colorPalette: string[];

  /**
   * Hide the color picker dialog
   * @default false
   */
  hideColorPicker: boolean;

  /**
   * Hide the text input field
   * @default false
   */
  hideTextInput: boolean;
}
```

### Return Value

Returns a string in hexadecimal format (e.g., "#FF0000" for red).

## Troubleshooting

### Common Issues

1. Color not updating: Ensure your form is properly initialized
2. Palette not showing: Verify the colorPalette array contains valid hex colors
3. Color picker not appearing: Check that the required modules are properly imported

## Running unit tests

Run `nx test input-color-picker` to execute the unit tests.

## Useful links

- [ngx-colors](https://ngx-colors.web.app/overview)
- [Shared form feature](../../feature/README.md)
