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
3. **Payment** (`/carret/pagament`): Select payment method and enter payment details.
4. **Confirmation** (`/carret/confirmacio`): Review order and confirm purchase.

## Running unit tests

Run `nx test eco-store-cart-feature` to execute the unit tests via Jest.
