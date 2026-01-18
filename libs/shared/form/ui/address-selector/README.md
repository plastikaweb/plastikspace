# @plastik/shared/form/ui/address-selector

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular%20material-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/form/ui/address-selector](#plastiksharedformuiaddress-selector)
  - [Description](#description)
  - [Usage](#usage)
    - [Module Setup](#module-setup)
    - [Formly Configuration](#formly-configuration)
  - [API Reference](#api-reference)
    - [Props Interface](#props-interface)
    - [UserContact Interface](#usercontact-interface)
  - [Running unit tests](#running-unit-tests)

## Description

A **Formly-compatible address selector component** for Angular forms.
It displays a list of saved user addresses with the ability to select one as the active address, and supports editing functionality through optional callbacks.

## Usage

### Module Setup

Import the module in your feature module:

```typescript
import { AddressSelectorFormlyModule } from '@plastik/shared/form/ui/address-selector';

@NgModule({
  imports: [AddressSelectorFormlyModule],
})
export class FeatureModule {}
```

### Formly Configuration

The component type name is: `address-selector`.

```typescript
const fields: FormlyFieldConfig[] = [
  {
    key: 'shippingAddress',
    type: 'address-selector',
    props: {
      label: 'Shipping Address',
      addresses: userAddresses,
      editable: true,
      onEdit: address => {
        // Handle address edit logic
        console.log('Editing address:', address);
      },
    },
  },
];
```

## API Reference

### Props Interface

| Name        | Type                             | Default     | Description                                       |
| :---------- | :------------------------------- | :---------- | :------------------------------------------------ |
| `addresses` | `UserContact[]`                  |             | Array of user addresses to display. **Required.** |
| `editable`  | `boolean`                        | `undefined` | Enable/disable edit button for each address.      |
| `onEdit`    | `(address: UserContact) => void` | `undefined` | Callback function triggered when edit is clicked. |

### UserContact Interface

| Name       | Type      | Description                          |
| :--------- | :-------- | :----------------------------------- |
| `id`       | `string`  | Unique identifier for the address.   |
| `name`     | `string`  | Name associated with the address.    |
| `fullName` | `string`  | Full name of the person.             |
| `address`  | `string`  | Street address.                      |
| `zip`      | `string`  | Postal/ZIP code.                     |
| `city`     | `string`  | City name.                           |
| `province` | `string`  | Province or state.                   |
| `country`  | `string`  | Country name.                        |
| `phone`    | `string`  | Phone number.                        |
| `default`  | `boolean` | Whether this is the default address. |

## Running unit tests

Run `nx test shared-form-ui-address-selector` to execute the unit tests.
