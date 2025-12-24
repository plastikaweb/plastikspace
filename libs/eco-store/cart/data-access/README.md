# @plastik/eco-store/cart/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/cart/data-access](#plastikeco-storecartdata-access)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Store Usage](#store-usage)
    - [SignalStore Features](#signalstore-features)
  - [Running unit tests](#running-unit-tests)

## Description

This library manages the shopping cart state for the [**Eco Store application**](../../../../apps/eco-store/README.md).
It uses **NgRx Signals** for reactive state management and **ngrx-toolkit** for automatic synchronization with local storage.

## Features

- **Reactive State**: Built with `signalStore` for performant, signal-based state management.
- **Local Storage Persistence**: Automatically syncs cart state to `localStorage` under the key `eco_cart_v1` using `withStorageSync`.
- **Computed Totals**: Automatically calculates and updates derived state:
  - `itemsCount`: Total number of items in the cart.
  - `totalAmount`: Total price of all items.
  - `isEmpty`: Boolean check for cart status.
- **Smart Cart Operations**:
  - `addToCart`: Adds new items or increments quantity if the item already exists. Handles removal if quantity becomes <= 0.
  - `removeFromCart`: Removes items by ID.

## Installation

```ts
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
```

## Usage

### Store Usage

Inject the store in your components to access cart state and methods.

```typescript
@Component({ ... })
export class CartComponent {
  readonly cartStore = inject(ecoStoreCartStore);

  // Access signals
  items = this.cartStore.items;
  count = this.cartStore.itemsCount;
  total = this.cartStore.totalAmount;

  addItem(product: EcoStoreProductWithCategoryName) {
    this.cartStore.addToCart(product, 1);
  }

  clear() {
    this.cartStore.clearCart();
  }
}
```

### SignalStore Features

The store exposes the following signals and methods:

- **State Signals**:
  - `items()`: Array of `CartItem` objects.
- **Computed Signals**:
  - `itemsCount()`: Total quantity of all products.
  - `totalAmount()`: Total cost (sum of price \* quantity).
  - `isEmpty()`: True if the cart has no items.
- **Methods**:
  - `addToCart(product, quantity?)`: Add or update item.
  - `removeFromCart(productId)`: Remove item.
  - `clearCart()`: Empty the cart.
  - `getItemCount(productId)`: Returns a computed signal with the quantity of the product.

## Running unit tests

Run `nx test eco-store-cart-data-access` to execute the unit tests via Jest.
