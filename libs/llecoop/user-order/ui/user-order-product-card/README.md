# ui-user-order-product-card

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Usage](#usage)
- [Running unit tests](#running-unit-tests)

## Overview

This library provides a reusable Angular Material card component for displaying product information in the LleCoop user ordering system. The component is designed to show product details and allow users to add products to their shopping cart with specified quantities.

### Features

- Displays product information (name, description, price, etc.)
- Shows product image with fallback support
- Allows users to select product quantities
- Calculates and displays total price based on quantity
- Provides buttons for viewing product details and adding to cart
- Supports product categorization with color-coded chips
- Fully compatible with Angular's OnPush change detection

### Usage

```typescript
import { UiUserOrderProductCardComponent } from '@plastik/llecoop/user-order/ui/user-order-product-card';

// In your component's template:
<plastik-ui-user-order-product-card
  [product]="product"
  [index]="index"
  (viewDetails)="handleViewDetails($event)"
  (addToCart)="handleAddToCart($event)">
</plastik-ui-user-order-product-card>
```

## Running unit tests

Run `nx test ui-user-order-product-card` to execute the unit tests.
