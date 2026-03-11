# @plastik/eco-store/orders/feature/detail

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/orders/feature/detail](#plastikeco-storeordersfeaturedetail)
  - [Description](#description)
  - [Features](#features)
  - [Running unit tests](#running-unit-tests)

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
