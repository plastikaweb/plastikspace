# @plastik/shared/form/ui/shipping-method-selector

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular%20material-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/form/ui/shipping-method-selector](#plastiksharedformuishipping-method-selector)
  - [Description](#description)
  - [Usage](#usage)
    - [Module Setup](#module-setup)
    - [Formly Configuration](#formly-configuration)
  - [API Reference](#api-reference)
    - [Props Interface](#props-interface)
  - [Running unit tests](#running-unit-tests)

## Description

A **Formly-compatible shipping method selector component** for Angular forms.
It renders a card-based UI for selecting shipping methods, displaying icons, titles, and subtitles for each option.

## Usage

### Module Setup

Import the module in your feature module:

```typescript
import { ShippingMethodSelectorFormlyModule } from '@plastik/shared/form/ui/shipping-method-selector';

@NgModule({
  imports: [ShippingMethodSelectorFormlyModule],
})
export class FeatureModule {}
```

### Formly Configuration

The component type name is: `shipping-method-selector`.

```typescript
const fields: FormlyFieldConfig[] = [
  {
    key: 'shippingMethod',
    type: 'shipping-method-selector',
    props: {
      options: [
        {
          value: 'pickup',
          icon: 'store',
          title: 'Recollida (Pickup)',
          subtitle: 'Free - Ready in 2h',
          iconBgColor: 'bg-neutral-400',
        },
        {
          value: 'delivery',
          icon: 'local_shipping',
          title: 'Enviament (Delivery)',
          subtitle: 'From €5.00 - 24/48h',
          iconBgColor: 'bg-tertiary-500',
        },
      ],
    },
  },
];
```

## API Reference

### Props Interface

| Name      | Type                     | Default | Description                                                |
| :-------- | :----------------------- | :------ | :--------------------------------------------------------- |
| `options` | `ShippingMethodOption[]` |         | Array of shipping method options to display. **Required.** |

**ShippingMethodOption Interface:**

| Name          | Type     | Default     | Description                                       |
| :------------ | :------- | :---------- | :------------------------------------------------ |
| `value`       | `string` |             | Unique value identifier for the option.           |
| `icon`        | `string` |             | Material icon name to display.                    |
| `title`       | `string` |             | Main title text for the option.                   |
| `subtitle`    | `string` |             | Secondary text (e.g., price, delivery time).      |
| `iconColor`   | `string` | `undefined` | Optional CSS class for the icon color.            |
| `iconBgColor` | `string` | `undefined` | Optional CSS class for the icon background color. |

## Running unit tests

Run `nx test shared-form-ui-shipping-method-selector` to execute the unit tests.
