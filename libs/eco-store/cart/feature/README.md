# @plastik/eco-store/cart/feature

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Material](https://img.shields.io/badge/material_ui-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/cart/feature](#plastikeco-storecartfeature)
  - [Description](#description)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Route Configuration](#route-configuration)
  - [Cart Steps](#cart-steps)
  - [Running unit tests](#running-unit-tests)

## Description

The **Cart Feature** library provides the complete shopping cart checkout flow for the Eco Store application. It implements a multi-step checkout process using Angular Material Stepper with route-based navigation.

## Features

- **Multi-Step Checkout**: Four-step process (Summary, Shipping, Payment, Confirmation).
- **Route-Based Navigation**: Each step has its own route for direct access and browser history support.
- **Linear Stepper**: Guides users through the checkout process in sequence.
- **Lazy-Loaded Steps**: Each step component is lazy-loaded for optimal performance.
- **Cart Summary**: Displays cart items grouped by category with quantity controls.
- **Material Design**: Uses Angular Material components for a consistent UI.

## Architecture

The cart feature uses a routed stepper pattern where:

- **`EcoStoreCartComponent`**: Shell component that renders the `mat-stepper` and syncs it with the router.
- **Child Routes**: Each step is a separate route that loads its component lazily.
- **URL Sync**: The stepper automatically updates when the URL changes and vice versa.

## Implementation notes

This section provides a few developer-focused notes and examples for common integration points.

- Hidden / model-only form fields

  Some values used during checkout (for example, `shippingAmount`) are stored in the form model but are not intended to be visible controls. To keep compatibility with Formly and avoid runtime errors caused by unregistered custom types, implement such fields using the built-in `input` type and set `props.type = 'hidden'`.

  Example Formly field configuration:

```plastikspace/libs/eco-store/cart/feature/README.md#L1-200
{
  key: 'shippingAmount',
  type: 'input',
  props: { type: 'hidden' },
  hooks: {
    onInit: (formly) => {
      // compute and set shipping amount on init or when related fields change
      formly.formControl?.setValue(computedShippingAmount);
    }
  }
}
```

- Stepper / router synchronization

  The cart shell (`EcoStoreCartComponent`) derives the selected step index from router events. Before navigating to a step as a response to a user action, the component compares the currently-derived index with the target index and only navigates when they differ. This prevents navigation loops and reduces unnecessary router calls.

- Formly UI components used by the cart

  The shared Formly UI components used in the shipping step (such as `address-selector` and `shipping-method-selector`) render card-based controls. For styling reasons the native radio input may be visually hidden; automated tests should select options by semantic values or data attributes rather than relying on a visible radio element.

If you need, I can add short code examples showing how to select options in tests or how to compute shipping amount based on tenant configuration.

## Installation

This library is part of the `@plastik/eco-store` scope. Import the routes in your application routing configuration.

## Usage

### Route Configuration

```typescript
import { Route } from '@angular/router';
import { ecoStoreCartRoutes } from '@plastik/eco-store/cart/feature';

export const routes: Route[] = [
  {
    path: 'carret',
    children: ecoStoreCartRoutes,
  },
];
```

## Cart Steps

1. **Summary** (`/carret/resum`): View cart items, adjust quantities, remove items.
2. **Shipping** (`/carret/enviament`): Enter shipping address and delivery preferences.
3. **Confirmation** (`/carret/confirmacio`): Review order and confirm purchase.

## Running unit tests

Run `nx test eco-store-cart-feature` to execute the unit tests via Jest.
