# @plastik/llecoop/order-list/feature/list

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/llecoop/order-list/feature/list](#plastikllecooporder-listfeaturelist)
  - [Description](#description)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Components](#components)
  - [Running unit tests](#running-unit-tests)

## Description

This library contains the **feature to display and manage weekly order lists** for cooperative members.
It provides a comprehensive interface for viewing, filtering, and managing order lists that are available for users on a weekly basis.

## Features

- **Order List Management**: View and manage weekly order lists with detailed information.
- **Filtering Capabilities**: Filter orders by various criteria using a configurable form.
- **New Order Creation**: Initiate new weekly order lists with customizable settings.
- **Order Details**: Expand order items to view detailed information and totals.
- **Actions Management**: Delete orders with confirmation dialogs.
- **Responsive Design**: Works across different device sizes with adaptive layouts.

## Architecture

The library follows a facade pattern to manage the data flow and user interactions:

- **Facade Service**: `LlecoopOrderListFeatureListFacadeService` handles all business logic.
- **Table Configuration**: Configurable table definitions for displaying order data.
- **Form Integration**: Uses the shared form component with autofocus capability.
- **State Management**: Integrates with the order list store for data persistence.

## Components

- **Main List Component**: Displays order lists with filtering and pagination.
- **Total Detail Component**: Shows order totals when an order is expanded.
- **Search Form**: Allows filtering of order lists based on various criteria.

## Running unit tests

Run `nx test llecoop-order-list-feature-list` to execute the unit tests.
