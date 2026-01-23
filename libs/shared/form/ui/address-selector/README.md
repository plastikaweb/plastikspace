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
It displays a list of saved user addresses with the ability to select one as the active address and supports editing functionality through optional callbacks.

This component is used by the Eco Store cart shipping step and has been adjusted for improved presentation and accessibility. Address items are presented using a compact layout with optional country information and visual affordances (icons and spacing). The component is designed to work with Formly and the form model: selected address values are part of the form model so downstream logic (shipping calculation, validation) can rely on them.

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

Example usage with Formly:

```typescript
const fields: FormlyFieldConfig[] = [
  {
    key: 'shippingAddress',
    type: 'address-selector',
    props: {
      translate: true,
      required: true,
      label: 'Shipping Address',
      // addresses: an array of UserContact objects (see API Reference)
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

Notes:

- The address item view supports an optional `country` field; if present it will be shown after city/zip.
- Presentation uses a compact grid and an optional icon per address; adjust CSS utility classes if you need different spacing or visual emphasis.
- The component integrates with the Formly form model: selection updates the model and participates in validation/submission flows.

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

## Notes

- Visual / behavior changes: recent updates improved spacing and layout for address items and made the address details render in a two-column compact layout. If your automated tests rely on exact DOM structure, update selectors to target the semantic data (e.g. value/key) rather than fragile layout-specific classes.
- Form integration: the component exposes and consumes form model values; hidden or auxiliary fields used in shipping calculations should be persisted in the form model so downstream logic (shipping cost calculation, validation) works reliably.
- If you rely on a visible native control (radio/checkbox) in tests, prefer selecting by the option value or adjust tests to account for the visual-only card selection (the underlying interactive control may be visually hidden for styling reasons).

## Running unit tests

Run `nx test shared-form-ui-address-selector` to execute the unit tests.
