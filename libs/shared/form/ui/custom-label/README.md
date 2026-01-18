# @plastik/shared/form/ui/custom-label

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular%20material-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/form/ui/custom-label](#plastiksharedformuicustom-label)
  - [Description](#description)
  - [Usage](#usage)
    - [Module Setup](#module-setup)
    - [Formly Configuration](#formly-configuration)
  - [API Reference](#api-reference)
    - [Props Interface](#props-interface)
  - [Running unit tests](#running-unit-tests)

## Description

A **Formly-compatible custom label component** for Angular forms.
It displays a custom label with optional icon support, allowing for flexible styling and positioning of icons relative to the label text.

## Usage

### Module Setup

Import the module in your feature module:

```typescript
import { CustomLabelFormlyModule } from '@plastik/shared/form/ui/custom-label';

@NgModule({
  imports: [CustomLabelFormlyModule],
})
export class FeatureModule {}
```

### Formly Configuration

The component type name is: `custom-label`.

```typescript
const fields: FormlyFieldConfig[] = [
  {
    key: 'shippingInfo',
    type: 'custom-label',
    props: {
      label: 'Shipping Information',
      icon: 'local_shipping',
      iconPosition: 'left',
      description: 'Please provide your shipping details',
      containerClasses: 'px-4 py-2',
      labelClasses: 'text-lg font-semibold',
      iconClasses: 'text-primary-600',
    },
  },
];
```

## API Reference

### Props Interface

| Name               | Type                | Default     | Description                                          |
| :----------------- | :------------------ | :---------- | :--------------------------------------------------- |
| `label`            | `string`            |             | The label text to display. **Required.**             |
| `key`              | `string`            |             | Unique identifier for the form field. **Required.**  |
| `description`      | `string`            | `undefined` | Optional description text displayed below the label. |
| `icon`             | `string`            | `undefined` | Material icon name to display alongside the label.   |
| `iconPosition`     | `'left' \| 'right'` | `undefined` | Position of the icon relative to the label.          |
| `containerClasses` | `string`            | `undefined` | CSS classes for the container element.               |
| `labelClasses`     | `string`            | `undefined` | CSS classes for the label text.                      |
| `iconClasses`      | `string`            | `undefined` | CSS classes for the icon element.                    |
| `value`            | `string`            | `undefined` | The current value of the field.                      |

## Running unit tests

Run `nx test shared-form-ui-custom-label` to execute the unit tests.
