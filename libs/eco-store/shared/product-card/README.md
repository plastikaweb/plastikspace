# @plastik/eco-store/shared/product-card

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Material](https://img.shields.io/badge/material_ui-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/shared/product-card](#plastikeco-storesharedproduct-card)
  - [Description](#description)
  - [Installation](#installation)
  - [Usage](#usage)
    - [EcoStoreProductCardComponent](#ecostoreproductcardcomponent)
      - [Inputs](#inputs)
      - [Outputs](#outputs)
    - [EcoStoreProductCardQuantityControlComponent](#ecostoreproductcardquantitycontrolcomponent)
      - [Inputs](#inputs-1)
      - [Outputs](#outputs-1)
  - [Feature Integration](#feature-integration)
  - [Running unit tests](#running-unit-tests)

## Description

A collection of components for displaying products in a grid or list view within the Eco Store application. It integrates several shared components for a consistent UI.

## Installation

```ts
import {
  EcoStoreProductCardComponent,
  EcoStoreProductCardQuantityControlComponent,
} from '@plastik/eco-store/shared/product-card';
```

## Usage

### EcoStoreProductCardComponent

The main component that displays a product card with its image, name, price, and actions.

Selector: `eco-store-product-card`

#### Inputs

| Input            | Type                                      | Default | Description                                                         |
| ---------------- | ----------------------------------------- | ------- | ------------------------------------------------------------------- |
| `product`        | `EcoStoreProductWithCategoryName \| null` | `null`  | The product data to display.                                        |
| `isFirst`        | `boolean`                                 | `false` | Whether it is the first item in a list (useful for prioritization). |
| `minimalVersion` | `boolean`                                 | `false` | Whether to show a simplified version of the card.                   |

#### Outputs

| Output           | Type                               | Description                                                  |
| ---------------- | ---------------------------------- | ------------------------------------------------------------ |
| `addToCart`      | `{ id: string; quantity: number }` | Emitted when quantity changes or "Add to Cart" is triggered. |
| `toggleFavorite` | `string`                           | Emitted when the favorite button is clicked.                 |
| `getProduct`     | `{ category: string; id: string }` | Emitted to go to the product detail.                         |

### EcoStoreProductCardQuantityControlComponent

A specialized component for managing product quantities, supporting both units and variable weights.

Selector: `eco-store-product-card-quantity-control`

#### Inputs

| Input         | Type                          | Default      | Description                   |
| ------------- | ----------------------------- | ------------ | ----------------------------- |
| `quantity`    | `number`                      | `0`          | Current quantity value.       |
| `unitType`    | `EcoStoreProduct['unitType']` | **Required** | Type of unit for the product. |
| `minQuantity` | `number`                      | `0`          | Minimum allowed quantity.     |

#### Outputs

| Output           | Type     | Description                           |
| ---------------- | -------- | ------------------------------------- |
| `quantityChange` | `number` | Emitted when the quantity is updated. |

## Feature Integration

The `EcoStoreProductCardComponent` integrates the following shared libraries:

- `EcoStoreProductCategoryLabelComponent` from `@plastik/eco-store/shared/product-category-label`
- `EcoStoreProductPriceComponent` from `@plastik/eco-store/shared/product-price`
- `EcoStoreSharedFavoriteButtonComponent` from `@plastik/eco-store/shared/favorite-button`

## Running unit tests

Run `nx test eco-store-shared-product-card` to execute the unit tests via Jest.
