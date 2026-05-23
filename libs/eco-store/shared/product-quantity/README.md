# @plastik/eco-store/shared/product-quantity

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Material](https://img.shields.io/badge/material_ui-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/shared/product-quantity](#plastikeco-storesharedproduct-quantity)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
    - [Modes](#modes)
  - [Examples](#examples)
  - [Running unit tests](#running-unit-tests)

## Description

A specialized quantity control component for the Eco Store application that handles both unit-based and weight-based products.
It provides an intuitive interface for adjusting product quantities with smart validation based on product constraints.

## Features

- **Smart Quantity Management**: Handles different unit types (units, weight) with appropriate step increments.
- **Validation**: Enforces minimum/maximum quantity limits and stock availability.
- **Multiple Modes**: Adapts UI for card, detail, and summary views.
- **Responsive Sizes**: Supports small, medium, and large display sizes.
- **Change Detection**: Tracks if the quantity has been modified from its initial value.
- **Manual Input**: Allows direct quantity input with validation.

## Installation

```ts
import { EcoStoreProductQuantityComponent } from '@plastik/eco-store/shared/product-quantity';
```

## Usage

Selector: `eco-store-product-quantity`

### Inputs

| Input      | Type                              | Default      | Description                                 |
| ---------- | --------------------------------- | ------------ | ------------------------------------------- |
| `product`  | `EcoStoreProductWithCategoryName` | **Required** | The product to control quantity for.        |
| `quantity` | `number`                          | `0`          | Current quantity value.                     |
| `mode`     | `'card' \| 'detail' \| 'summary'` | `'card'`     | Display mode for the control.               |
| `size`     | `'sm' \| 'md' \| 'lg'`            | `'md'`       | Visual size of the component.               |
| `isInCart` | `boolean`                         | `false`      | Whether the product is already in the cart. |

### Outputs

| Output           | Type     | Description                                       |
| ---------------- | -------- | ------------------------------------------------- |
| `quantityChange` | `number` | Emitted when the quantity is updated.             |
| `addToCart`      | `number` | Emitted when the "Add to Cart" button is clicked. |

### Modes

- **card**: Compact view for product cards. Shows "+" button when quantity is 0.
- **detail**: Expanded view for product detail pages. Always shows full controls.
- **summary**: Minimal view for cart summary. Optimized for space.

## Examples

**Product Card Usage**:

```html
<eco-store-product-quantity
  [product]="product()"
  [quantity]="cartQuantity()"
  [mode]="'card'"
  [size]="'md'"
  [isInCart]="isInCart()"
  (quantityChange)="onQuantityChange($event)"
  (addToCart)="onAddToCart($event)" />
```

**Product Detail Usage**:

```html
<eco-store-product-quantity
  [product]="product()"
  [quantity]="selectedQuantity()"
  [mode]="'detail'"
  [size]="'lg'"
  (quantityChange)="updateQuantity($event)"
  (addToCart)="addToCart($event)" />
```

## Running unit tests

Run `nx test eco-store-shared-product-quantity` to execute the unit tests via Vitest.
