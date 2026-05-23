# @plastik/eco-store/shared/product-price

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-%2300A86B.svg?style=for-the-badge&logo=google-translate&logoColor=white)

- [@plastik/eco-store/shared/product-price](#plastikeco-storesharedproduct-price)
  - [Description](#description)
  - [Installation](#installation)
  - [Usage](#usage)
    - [EcoStoreProductPriceComponent](#ecostoreproductpricecomponent)
      - [Inputs](#inputs)
      - [Example](#example)
    - [EcoStoreUnitChipComponent](#ecostoreunitchipcomponent)
      - [Inputs](#inputs-1)
  - [Running unit tests](#running-unit-tests)

## Description

Reusable components for displaying product prices and unit information within the Eco Store application. It handles currency formatting and unit chip visualization using the shared chip component.

## Installation

```ts
import {
  EcoStoreProductPriceComponent,
  EcoStoreUnitChipComponent,
} from '@plastik/eco-store/shared/product-price';
```

## Usage

### EcoStoreProductPriceComponent

Selector: `eco-store-product-price`

Displays the product price with formatting, currency symbol, and unit type. It also includes the `EcoStoreUnitChipComponent`.

#### Inputs

| Input             | Type                               | Default      | Description                                                |
| ----------------- | ---------------------------------- | ------------ | ---------------------------------------------------------- |
| `price`           | `number`                           | **Required** | The product price with IVA included.                       |
| `unitType`        | `EcoStoreProduct['unitType']`      | **Required** | The type of unit for translation (e.g., 'weight', 'unit'). |
| `unitBase`        | `EcoStoreProduct['unitBase']`      | **Required** | The base unit string for the chip (e.g., 'kg', 'unitat').  |
| `size`            | `'sm' \| 'md' \| 'lg' \| 'detail'` | `'md'`       | The visual size of the price display.                      |
| `unitChipVisible` | `boolean`                          | `true`       | Whether to show the unit chip component.                   |

#### Example

```html
<eco-store-product-price
  [price]="product().priceWithIva"
  [unitType]="product().unitType"
  [unitBase]="product().unitBase"
  [size]="'detail'" />
```

### EcoStoreUnitChipComponent

Selector: `eco-store-unit-chip`

Displays a small badge with the base unit of the product. It leverages `SharedChipComponent` (`<plastik-shared-chip>`) for consistent styling.

#### Inputs

| Input      | Type                          | Default      | Description                             |
| ---------- | ----------------------------- | ------------ | --------------------------------------- |
| `unitType` | `EcoStoreProduct['unitType']` | **Required** | The type of unit.                       |
| `unitBase` | `EcoStoreProduct['unitBase']` | **Required** | The unit label to display (e.g., 'kg'). |

## Running unit tests

Run `nx test eco-store-shared-product-price` to execute the unit tests via Vitest.
