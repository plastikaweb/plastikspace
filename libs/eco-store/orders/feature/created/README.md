# @plastik/eco-store/orders/feature/created

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Material](https://img.shields.io/badge/material_ui-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/orders/feature/created](#plastikeco-storeordersfeaturecreated)
  - [Description](#description)
  - [Components](#components)
    - [OrderConfirmationComponent](#orderconfirmationcomponent)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Route Configuration](#route-configuration)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Orders Created Feature** library provides the order confirmation view which is displayed after a successful checkout.
It notifies the user that their order has been placed and provides details about the next steps.

Part of the [**Eco-Store**](../../../../../apps/eco-store/README.md) application.

## Components

### OrderConfirmationComponent

The `OrderConfirmationComponent` is a routed component that displays a confirmation message after a user successfully places an order.
It shows the order status, notifies the user about email confirmation, and provides navigation options back to the store or their order history.

**Behavior:**

- Retrieves the order ID from the route.
- Fetches order details from `ecoStoreOrdersStore` using the order ID.
- Displays the user's email fetched from `pocketBaseUserProfileStore`.
- Designed with Angular Material taking advantage of customized card and button styling.

**Translation Keys:**

All text content is internationalized under the `cart.finish` namespace:

- `title`: Main heading text
- `orderNumber`: Label for the order number
- `emailNotice`: Notification that an email was sent to the user
- `orderReadyNotification`: Explanation of the current process phase
- `modifyReminder`: Instructions on modifying orders
- `ordersHistory`: Navigation label to go to orders
- `backToStore`: Navigation label to go to the store
- `ecoBadgeAlt`: Alternative text for the eco badge product tag

**Example Usage:**

```html
<eco-order-confirmation></eco-order-confirmation>
```

## Installation

This library is part of the `@plastik/eco-store` scope. Import the routes in your application routing configuration.

## Usage

### Route Configuration

```typescript
import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'comanda/:id',
    loadComponent: () =>
      import('@plastik/eco-store/orders/feature').then(m => m.OrderConfirmationComponent),
  },
];
```

## Running unit tests

Run `nx test eco-store-order-created` to execute the unit tests via Vitest.
