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
  - [Feature Integration](#feature-integration)
  - [View Transitions](#view-transitions)
  - [Running unit tests](#running-unit-tests)

## Description

A collection of components for displaying products in a grid or list view within the Eco Store application. It integrates several shared components for a consistent UI.

## Installation

```ts
import { EcoStoreProductCardComponent } from '@plastik/eco-store/shared/product-card';
```

## Usage

### EcoStoreProductCardComponent

The main component that displays a product card with its image, name, price, and actions.

Selector: `eco-store-product-card`

#### Inputs

| Input            | Type                                      | Default | Description                                                                                               |
| ---------------- | ----------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `product`        | `EcoStoreProductWithCategoryName \| null` | `null`  | The product data to display.                                                                              |
| `isFirst`        | `boolean`                                 | `false` | Whether it is the first item in a list (useful for prioritization).                                       |
| `minimalVersion` | `boolean`                                 | `false` | Whether to show a simplified version of the card.                                                         |
| `quantity`       | `number`                                  | `0`     | The quantity formatted from the cart.                                                                     |
| `isOpen`         | `boolean`                                 | `true`  | Whether the store is open for orders. If false, hides quantity controls and shows a "View detail" button. |

#### Outputs

| Output           | Type                                                             | Description                                                  |
| ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| `addToCart`      | `{ product: EcoStoreProductWithCategoryName; quantity: number }` | Emitted when quantity changes or "Add to Cart" is triggered. |
| `toggleFavorite` | `string`                                                         | Emitted when the favorite button is clicked.                 |
| `getProduct`     | `{ category: string; id: string }`                               | Emitted to go to the product detail.                         |

## Feature Integration

The `EcoStoreProductCardComponent` integrates the following shared libraries:

- `EcoStoreProductCategoryLabelComponent` from `@plastik/eco-store/shared/product-category-label`
- `EcoStoreProductPriceComponent` from `@plastik/eco-store/shared/product-price`
- `EcoStoreSharedFavoriteButtonComponent` from `@plastik/eco-store/shared/favorite-button`

## View Transitions

This module incorporates smooth CSS view transitions to provide a seamless and visually appealing user experience during interactions and navigation.

## Running unit tests

Run `nx test eco-store-shared-product-card` to execute the unit tests via Jest.
