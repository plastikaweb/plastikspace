# @plastik/eco-store/orders/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/orders/data-access](#plastikeco-storeordersdata-access)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Reference](#api-reference)
    - [Store Methods](#store-methods)
    - [Inherited CRUD Methods](#inherited-crud-methods)
  - [Loading Strategy](#loading-strategy)
  - [Related Libraries](#related-libraries)
  - [Running unit tests](#running-unit-tests)

## Description

This library manages the **orders data access layer** for the
[Eco Store application](../../../../apps/eco-store/README.md).
It provides a Signal Store for order CRUD operations backed by PocketBase,
including a specialized `createOrder()` method that orchestrates the full checkout flow
(order creation, cart reset, and navigation).

## Features

- **Full CRUD**: Inherits list, getOne, create, update, and delete from `withPocketBaseCrud`.
- **Checkout Flow**: The `createOrder()` method converts the current cart to an order, resets the cart, and navigates to the order confirmation page.
- **PocketBase Integration**: Uses `EcoStoreOrdersApiService` to communicate with the `orders` collection.
- **Explicit Loading State**: The `createOrder()` method manually drives the global `activityStore` with a checkout-specific i18n message key.
- **DevTools**: All state changes are tracked in Redux DevTools under the `orders` feature name.

## Installation

```ts
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';
```

## Usage

```typescript
@Component({ ... })
export class CheckoutComponent {
  readonly ordersStore = inject(ecoStoreOrdersStore);

  async onConfirmOrder() {
    await this.ordersStore.createOrder();
    // Cart is cleared and navigation to /comanda/:id happens automatically
  }
}
```

## API Reference

### Store Methods

- **`createOrder()`** - Converts the current cart state to an `EcoStoreOrder`, creates it in PocketBase, resets the cart, and navigates to `/comanda/:id`.
  The entire operation is wrapped with `activityStore.setActivity(true, 'cart.finish.creatingOrder')` / `setActivity(false)` to display a labeled global overlay loader.

### Inherited CRUD Methods

From `withPocketBaseCrud`:

- **`create(data, options?)`** - Create a record. Returns `Promise<EcoStoreOrder>`.
- **`update(id, data, options?)`** - Update a record. Returns `Promise<EcoStoreOrder>`.
- **`delete(id)`** - Delete a record. Returns `Promise<boolean>`.
- **`getList()`** - Load paginated list (auto-called on init).
- **`getOne(id)`** - Load a single order by ID.

## Loading Strategy

`createOrder()` uses the **Explicit activityStore** strategy.
It manually calls `activityStore.setActivity(true, 'cart.finish.creatingOrder')` before the async chain and `setActivity(false)` in a `finally` block once the checkout flow completes (or fails).
This ensures the global overlay is shown with the correct i18n message for the entire duration of the checkout operation.

> [!NOTE]
> For a complete description of all loading strategies available in Eco Store, see
> [LOADING_STRATEGIES.md](../../../../apps/eco-store/LOADING_STRATEGIES.md).

## Related Libraries

- [`@plastik/eco-store/cart/data-access`](../../cart/data-access/README.md) - Cart state management and `toOrder()` conversion
- [`@plastik/eco-store/entities`](../../core/entities/README.md) - `EcoStoreOrder` and `NewEcoStoreOrder` interfaces
- [`@plastik/shared/signal-state/data-access-pocketbase`](../../../shared/signal-state/data-access-pocketbase/README.md) - PocketBase Signal Store features
- [`@plastik/shared/activity/data-access`](../../../shared/activity/data-access/README.md) - Global activity/loading state

## Running unit tests

Run `nx test eco-store-orders-data-access` to execute the unit tests via Vitest.
