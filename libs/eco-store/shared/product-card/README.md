# @plastik/eco-store/product-card

- [@plastik/eco-store/product-card](#plastikeco-storeproduct-card)
  - [Description](#description)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Component](#component)
    - [ProductCard](#productcard)
      - [Selector](#selector)
      - [Inputs](#inputs)
      - [Outputs](#outputs)
      - [Features](#features)
      - [Example](#example)
  - [Styling](#styling)
  - [Dependencies](#dependencies)

## Description

A reusable product card component for the Eco Store application, built with Angular Signals and Material UI.
This component displays product information including an image, name, price, and interactive elements like a favorite button and add to cart functionality.

## Installation

This library is part of the `@plastik/eco-store` scope. To use it in your application:

1. Ensure the library is built in your Nx workspace
2. Import the `ProductCard` component in your module or standalone component

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

#### Selector

```html
<eco-store-product-card></eco-store-product-card>
```

#### Inputs

| Name      | Type                              | Required | Description                                                  |
| --------- | --------------------------------- | -------- | ------------------------------------------------------------ |
| `product` | `EcoStoreProductWithCategoryName` | Yes      | The product data to display, including category information. |

#### Outputs

| Name             | Type                               | Description                                                                             |
| ---------------- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| `addToCart`      | `{ id: string; quantity: number }` | Emitted when the "Add to Cart" button is clicked. Contains the product ID and quantity. |
| `toggleFavorite` | `string`                           | Emitted when the favorite button is clicked. Contains the product ID.                   |

#### Features

- Displays product image with fallback content when no image is available
- Shows product name, price, and unit type
- Displays category with a colored indicator
- Shows price per unit for products with unit types like kg or liters
- Interactive favorite button with hover effects
- Add to cart button with ripple effect
- Responsive design with hover animations
- Uses Angular's OnPush change detection for optimal performance

#### Example

```html
<eco-store-product-card
  [product]="product"
  (addToCart)="onAddToCart($event)"
  (toggleFavorite)="onToggleFavorite($event)">
</eco-store-product-card>
```
