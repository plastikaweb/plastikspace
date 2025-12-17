# @plastik/eco-store/product-card

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular_material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/product-card](#plastikeco-storeproduct-card)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Component](#component)
    - [ProductCard](#productcard)
      - [Inputs](#inputs)
      - [Outputs](#outputs)
      - [Example](#example)
  - [Running unit tests](#running-unit-tests)

## Description

A reusable **product card component** for the Eco Store application, built with Angular Signals and Material UI.
This component displays product information including an image, name, price, and interactive elements like a favorite button and add to cart functionality.

## Features

- Displays product image with fallback content when no image is available.
- Shows product name, price, and unit type.
- Displays category with a colored indicator.
- Shows price per unit for products with unit types like kg or liters.
- Interactive favorite button with hover effects.
- Add to cart button with ripple effect.
- Responsive design with hover animations.
- Uses Angular's `OnPush` change detection for optimal performance.
- **Navigation-safe interactions**: Click events on interactive elements (favorite button, quantity controls) are properly isolated to prevent triggering the card's `routerLink`.

## Installation

This library is part of the `@plastik/eco-store` scope. To use it in your application:

1. Ensure the library is built in your Nx workspace.
2. Import the `ProductCard` component in your module or standalone component.

```typescript
import { ProductCard } from '@plastik/eco-store/product-card';
```

## Usage

Import the `ProductCard` component and use it in your templates:

```typescript
import { Component } from '@angular/core';
import { ProductCard } from '@plastik/eco-store/product-card';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCard],
  template: `
    <eco-store-product-card
      [product]="product"
      (addToCart)="onAddToCart($event)"
      (toggleFavorite)="onToggleFavorite($event)">
    </eco-store-product-card>
  `,
})
export class ProductListComponent {
  product: EcoStoreProductWithCategoryName = {
    /* ... */
  };

  onAddToCart(event: { id: string; quantity: number }) {
    // Handle add to cart
  }

  onToggleFavorite(productId: string) {
    // Handle favorite toggle
  }
}
```

## Component

### ProductCard

A standalone component that displays a product card with image, details, and interactive controls.

**Selector:** `<eco-store-product-card>`

#### Inputs

| Name      | Type                              | Required | Description                                                  |
| :-------- | :-------------------------------- | :------- | :----------------------------------------------------------- |
| `product` | `EcoStoreProductWithCategoryName` | Yes      | The product data to display, including category information. |

#### Outputs

| Name             | Type                               | Description                                                                             |
| :--------------- | :--------------------------------- | :-------------------------------------------------------------------------------------- |
| `addToCart`      | `{ id: string; quantity: number }` | Emitted when the "Add to Cart" button is clicked. Contains the product ID and quantity. |
| `toggleFavorite` | `string`                           | Emitted when the favorite button is clicked. Contains the product ID.                   |

#### Example

```html
<eco-store-product-card
  [product]="product"
  (addToCart)="onAddToCart($event)"
  (toggleFavorite)="onToggleFavorite($event)">
</eco-store-product-card>
```

## Running unit tests

Run `nx test eco-store-shared-product-card` to execute the unit tests via [Jest](https://jestjs.io/).
