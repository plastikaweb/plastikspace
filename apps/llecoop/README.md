# Llecoop

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [Llecoop](#llecoop)
  - [Description](#description)
  - [Features](#features)
  - [Quick Start](#quick-start)
  - [Development Commands](#development-commands)
  - [Architecture \& Libraries](#architecture--libraries)
    - [🧩 Entities \& Utils](#-entities--utils)
    - [🎨 Layout \& UI](#-layout--ui)
    - [📦 Products \& Categories](#-products--categories)
    - [🛒 Orders](#-orders)
    - [👥 Users \& Profile](#-users--profile)
    - [🔄 Shared \& Triggers](#-shared--triggers)

## Description

**Llecoop** is the main application for managing a consumer cooperative. It handles user management, order processing, product catalogs, and payment tracking, streamlining the operations of the cooperative.

## Features

- **Cooperative Management**: Tools for managing orders and payments.
- **Role-Based Access**: Specialized views for admins and members.
- **Product Catalog**: Manage products and categories.
- **Order Tracking**: Comprehensive order status tracking.

## Quick Start

1. **Install Dependencies**: `yarn install`
2. **Serve Application**: `yarn llecoop:serve`

## Development Commands

- **Serve**: `yarn llecoop:serve`
- **Lint**: `yarn llecoop:lint`
- **Test**: `yarn llecoop:test`
- **E2E**: `yarn llecoop:e2e`
- **Build**: `yarn llecoop:build`

## Architecture & Libraries

### 🧩 Entities & Utils

- [**entities**](../../libs/llecoop/entities/README.md)
- [**util**](../../libs/llecoop/util/README.md)

### 🎨 Layout & UI

- [**cms-layout**](../../libs/llecoop/cms-layout/README.md)
- [**ui-category-name-cell**](../../libs/llecoop/category/ui/category-name-cell/README.md)
- [**ui-order-list-indicator**](../../libs/llecoop/order-list/feature/llecoop-order-indicator/README.md)
- [**util-order-list**](../../libs/llecoop/order-list/util/README.md)

### 📦 Products & Categories

- [**product-data-access**](../../libs/llecoop/product/data-access/README.md)
- [**product-feature-list**](../../libs/llecoop/product/feature/list/README.md)
- [**product-feature-detail**](../../libs/llecoop/product/feature/detail/README.md)
- [**category-data-access**](../../libs/llecoop/category/data-access/README.md)
- [**category-feature-list**](../../libs/llecoop/category/feature/list/README.md)
- [**category-feature-detail**](../../libs/llecoop/category/feature/detail/README.md)

### 🛒 Orders

- [**order-list-data-access**](../../libs/llecoop/order-list/data-access/README.md)
- [**order-list-feature-list**](../../libs/llecoop/order-list/feature/list/README.md)
- [**order-list-feature-user-order-detail**](../../libs/llecoop/order-list/feature/user-order-detail/README.md)
- [**order-list-feature-user-order-list**](../../libs/llecoop/order-list/feature/user-order-list/README.md)
- [**order-list-feature-order-list-user-order**](../../libs/llecoop/order-list/feature/order-list-user-order/README.md)
- [**user-order-cart-data-access**](../../libs/llecoop/user-order/cart/data-access/README.md)
- [**user-order-cart-feature-cart-preview**](../../libs/llecoop/user-order/cart/feature/cart-preview/README.md)
- [**user-order-cart-ui-mini-cart**](../../libs/llecoop/user-order/cart/ui/mini-cart/README.md)
- [**user-order-product-list-data-access**](../../libs/llecoop/user-order/product-list/data-access/README.md)
- [**user-order-product-list-feature**](../../libs/llecoop/user-order/product-list/feature/README.md)

### 👥 Users & Profile

- [**user-data-access**](../../libs/llecoop/user/data-access/README.md)
- [**user-feature-list**](../../libs/llecoop/user/feature/list/README.md)
- [**user-feature-create**](../../libs/llecoop/user/feature/create/README.md)
- [**profile-data-access**](../../libs/llecoop/profile/data-access/README.md)
- [**profile-feature**](../../libs/llecoop/profile/feature/README.md)

### 🔄 Shared & Triggers

- [**shared-data-access**](../../libs/llecoop/shared/data-access/README.md)
- [**llecoop-triggers**](../llecoop-triggers/README.md)
