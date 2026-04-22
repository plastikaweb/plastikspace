# @plastik/eco-store/orders/feature/detail

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/orders/feature/detail](#plastikeco-storeordersfeaturedetail)
  - [Description](#description)
  - [Features](#features)
  - [Running unit tests](#running-unit-tests)
  - [UI-UX Features](#ui-ux-features)

## Description

The **Eco Store Order Detail Feature** library provides the detailed view for a specific order in the Eco Store application.
It displays all items purchased, their final prices, delivery address, and payment status.

Part of the [**Eco-Store**](../../../../../apps/eco-store/README.md) application.

## Features

- **Order Detail View**: Comprehensive view of a single order.
- **Itemized List**: Shows each item with its quantity, price, and availability.
- **Status Tracking**: Visual representation of the current order status.
- **Delivery Information**: Displays the chosen delivery method and address.
- **State Management**: Uses `EcoStoreOrdersStore` to fetch and display the specific order.

## Running unit tests

Run `nx test eco-store-orders-detail` to execute the unit tests via [Vitest](https://vitest.dev/).

## UI-UX Features

- **Order Detail** page with an `hero-header` that adapts to mobile and desktop.
- **Actions** always visible on the hero-header.
- **Order Status** displayed in a `chip` with color and icon based on the status.
- **Delivery Information**: Delivery method and address displayed in two separate columns.
- **Payment Information**: Payment method and status displayed in two separate columns.
- **Open Order**: When an order is open, `edit` and `delete` buttons are displayed in a `Chip`.
- **Order Items** displayed in a `CartProductCard` component with `quantity`, `priceWithIva`, `iva`, `unitType`, `unitBase`, `images`, `categoryName`, `name`, `categorySlug`, `normalizedName`.
- **Order Total** displayed in a `CartOrderSummary` component with `subtotal`, `shipping`, `tax`, `total`, `refunded`, `discount`.
- **No Results**: When no order is found, `EcoStoreSharedNoResults` is displayed with `title`, `description`, and `action`.
- **Loading State**: When an order is loading, `EcoStoreSharedLoading` is displayed with `title`, `description`, and `action`.
