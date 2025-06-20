# User Order Cart Data Access Library

## Table of Contents

- [Overview](#overview)
- [Key Components](#key-components)
  - [UserOrderCartStore](#userordercartstore)
  - [LlecoopUserOrderFireService](#llecoopuserorderfireservice)
- [Features](#features)
- [Running unit tests](#running-unit-tests)

## Overview

This library provides data access functionality for managing user shopping carts in the LleCoop application. It handles cart state management, persistence, and Firebase integration, allowing users to add products to their cart and submit orders.

## Key Components

### UserOrderCartStore

A Signal-based state management store that handles the cart's state, including:

- Managing the cart items (adding, removing, updating)
- Calculating total prices
- Persisting cart data (localStorage and Firebase sync)
- Loading previously saved cart data

```typescript
// Example of using the cart store
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order/cart/data-access';

// Add item to cart
llecoopUserOrderCartStore.addItem({ product, quantity });

// Access cart data
const cartItems = llecoopUserOrderCartStore.cart();
const totalPrice = llecoopUserOrderCartStore.getCartTotalPrice();
```

### LlecoopUserOrderFireService

A Firebase service extending `EntityFireService` that handles:

- Retrieving user orders from Firestore
- Filtering and sorting orders
- Creating and updating orders in Firestore

```typescript
// Example of using the fire service
import { LlecoopUserOrderFireService } from '@plastik/llecoop/user-order/cart/data-access';

// In a component or service
constructor(private userOrderFireService: LlecoopUserOrderFireService) {}

// Get all orders with pagination, sorting and filtering
this.userOrderFireService.getAll(pagination, sorting, filter).subscribe(orders => {
  // Handle orders
});
```

## Features

- **Offline Support**: Cart data is persisted in localStorage when offline
- **User-specific Carts**: Cart data is associated with user IDs
- **Order Management**: Convert cart to orders and manage their lifecycle
- **Reactive Design**: Built with Angular's Signal-based architecture

## Running unit tests

Run `nx test user-order-cart` to execute the unit tests.
