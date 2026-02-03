# eco-store-cart-data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

## Table of Contents

- [eco-store-cart-data-access](#eco-store-cart-data-access)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Store Usage](#store-usage)
    - [SignalStore Features](#signalstore-features)
      - [State Signals](#state-signals)
      - [Computed Signals](#computed-signals)
      - [Methods](#methods)
  - [API Reference](#api-reference)
    - [State Interface](#state-interface)
  - [Running unit tests](#running-unit-tests)

## Description

This library manages the shopping cart state for the [**Eco Store application**](../../../../apps/eco-store/README.md).
It uses **NgRx Signals** for reactive state management and **ngrx-toolkit** for automatic synchronization with local storage.
In addition to the cart line items, it also stores **shipping configuration** such as address, delivery method, slot day/time and shipping amount,
as well as **order lifecycle metadata** including status, expiration date, order cycle reference, and customer notes.

## Features

- **Reactive State**: Built with `signalStore` for performant, signal-based state management
- **Local Storage Persistence**: Automatically syncs cart state to `localStorage` under the key `eco_cart_v1` using `withStorageSync`
- **Computed Totals**: Automatically calculates and updates derived state:
  - `itemsCount`: Total number of items in the cart
  - `totalAmount`: Net total (without IVA)
  - `totalAmountWithIva`: Total price of all items including IVA
  - `totalAmountIva`: Total IVA (difference between `totalAmountWithIva` and `totalAmount`)
  - `totalAmountWithShipping`: Grand total including shipping amount
  - `isEmpty`: Boolean check for cart status
  - `itemsGroupedByCategory`: Returns items grouped by category name
  - `itemsDictionary`: Returns entity map for quick lookups
- **Smart Cart Operations**:
  - `addToCart`: Adds new items or increments quantity if the item already exists. Handles removal if quantity becomes <= 0
  - `removeFromCart`: Removes items by ID
  - `clearCart`: Clears all items from the cart
  - `updateLogistics`: Updates shipping-related state (method, address, day, time and shipping cost)
  - `getItemCount`: Returns a computed signal with the quantity of a specific product

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
  total = this.cartStore.totalAmountWithIva;

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

#### State Signals

- `items()`: Array of `CartItem` objects
- `address()`: Shipping address or null
- `method()`: Delivery method or null
- `day()`: Selected delivery day or null
- `time()`: Selected delivery time or null
- `noDayAndTime()`: Boolean flag for no time slot selection
- `shipping()`: Shipping cost amount
- `status()`: Order status ('ACTIVE', 'DONE', or 'EXPIRED')
- `expiredAt()`: Order expiration date or null
- `orderCycle()`: Reference to the order cycle or null
- `notes()`: Customer notes or null

#### Computed Signals

- `itemsCount()`: Total quantity of all products
- `totalAmount()`: Net total without IVA
- `totalAmountWithIva()`: Total cost including IVA
- `totalAmountIva()`: Total tax amount (totalAmountWithIva - totalAmount)
- `totalAmountWithShipping()`: Grand total including shipping
- `isEmpty()`: True if the cart has no items
- `itemsGroupedByCategory()`: Returns an object where keys are category names and values are arrays of `CartItem` objects
- `itemsDictionary()`: Returns entity map for quick product lookups

#### Methods

- `addToCart(product, quantity?)`: Add or update item
- `removeFromCart(productId)`: Remove item
- `clearCart()`: Empty the cart
- `updateLogistics(logistics)`: Update shipping configuration
- `getItemCount(productId)`: Returns a computed signal with the quantity of the product

## API Reference

### State Interface

```typescript
interface CartItem {
  id: string;
  product: EcoStoreProductWithCategoryName;
  quantity: number;
}

interface EcoStoreCartState {
  address: UserContact | null;
  method: EcoStoreTenantLogisticsDeliveryType | null;
  day: SlotDays | null;
  time: TimeRange | null;
  noDayAndTime: boolean;
  shipping: number;
  status: 'ACTIVE' | 'DONE' | 'EXPIRED';
  expiredAt: Date | null;
  orderCycle: string | null;
  notes: string | null;
}
```

## Running unit tests

Run `nx test eco-store-cart-data-access` to execute the unit tests via Jest.
