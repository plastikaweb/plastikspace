# @plastik/eco-store/orders/feature/list

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/orders/feature/list](#plastikeco-storeordersfeaturelist)
  - [Description](#description)
  - [Features](#features)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Orders List Feature** library provides the order history and list functionality for the Eco Store application.
It allows users to view their past orders, their status, total price, and delivery details.

## Features

- **Order History Grid**: Displays a list of user orders with essential information at a glance.
- **Detailed Order Cards**: Individual cards for each order showing status, date, items count, and delivery method.
- **Order Filtering**: Allows users to filter their order history by status (Pending, Confirmed, etc.).
- **State Management**: Integrates with `EcoStoreOrdersStore` for reactive data fetching and pagination.
- **Pagination**: Support for navigating through order history.
- **Dynamic Status & Icons**: Visual cues for order status (Pending, Confirmed, Ready, etc.) and delivery methods.
- **Empty State**: User-friendly empty state with a call to action when no orders are found, including status-specific messages.
- **Modern Architecture**: Built with Angular 21 (Signals, Standalone Components, and logical control flow).

## Running unit tests

Run `nx test eco-store-orders-list` to execute the unit tests via [Vitest](https://vitest.dev/).
