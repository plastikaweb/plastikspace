# Eco-Store

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/pocketbase-%23b8dbe4.svg?style=for-the-badge&logo=Pocketbase&logoColor=black)

- [Eco-Store](#eco-store)
  - [Description](#description)
  - [Features](#features)
  - [Quick Start](#quick-start)
  - [Development Commands](#development-commands)
    - [🛠️ General](#️-general)
    - [🗄️ Backend (PocketBase)](#️-backend-pocketbase)
    - [🧪 Quality \& Testing](#-quality--testing)
  - [Architecture \& Libraries](#architecture--libraries)
    - [📦 Products](#-products)
    - [🧰 Shared Utils](#-shared-utils)
    - [🚀 Core Features](#-core-features)

## Description

**Eco-Store** is a modern consumer cooperative platform designed to facilitate sustainable and local shopping. It enables a community-driven commerce model with role-based access control and member management.

Built with **Angular 19+** (Signals, Standalone Components, Control Flow) and **PocketBase**.

## Features

- **Product Catalog**: Browse and filter sustainable products using a responsive grid.
- **Member Management**: Manage cooperative members and roles.
- **Reactive State**: Powered by NgRx Signal Store for efficient state management.
- **Backend Integration**: Seamless integration with PocketBase for real-time data and authentication.
- **Robust Testing**: Comprehensive unit and E2E testing suites.

## Quick Start

1. **Install Dependencies**: `yarn install`
2. **Start PocketBase**: `yarn eco-store:pocketbase:run`
3. **Run Application**: `yarn eco-store:serve`

## Development Commands

### 🛠️ General

- **Serve (Dev)**: `yarn eco-store:serve`
- **Build**: `yarn eco-store:build`
- **Test**: `yarn eco-store:test`
- **Lint**: `yarn eco-store:lint`

### 🗄️ Backend (PocketBase)

- **Start Local Server**: `yarn eco-store:pocketbase:run`
- **Sync Schema**: `yarn eco-store:local` (Run app with local PB)
- **Schema Guide**: [PocketBase Schema Management](./POCKETBASE_SCHEMA_MANAGEMENT.md)

### 🧪 Quality & Testing

- **E2E Tests**: `yarn eco-store:e2e`
- **Accessibility Check**: `yarn eco-store:a11y`

## Architecture & Libraries

### 📦 Products

- [**Feature Detail**](../../libs/eco-store/products/feature/detail/README.md): Product detail view.
- [**Feature List**](../../libs/eco-store/products/feature/list/README.md): Main product browsing interface.
- [**Data Access**](../../libs/eco-store/products/data-access/README.md): Product state and API services.
- [**Cart Data Access**](../../libs/eco-store/cart/data-access/README.md): Shopping cart state management.
- [**Cart Feature**](../../libs/eco-store/cart/feature/README.md): Multi-step checkout flow.
- [**Categories**](../../libs/eco-store/product-categories/data-access/README.md): Category management.
- [**Product Card**](../../libs/eco-store/shared/product-card/README.md): Shared product card component.
- [**Product Quantity**](../../libs/eco-store/shared/product-quantity/README.md): Quantity control with smart validation.
- [**Product Price**](../../libs/eco-store/shared/product-price/README.md): Price display and unit components.
- [**Category Label**](../../libs/eco-store/shared/product-category-label/README.md): Category badge component.
- [**Favorite Button**](../../libs/eco-store/shared/favorite-button/README.md): Product favorite toggle component.

### 🧰 Shared Utils

- [**Utils**](../../libs/eco-store/shared/utils/README.md): Unit formatting and shared helpers.
- [**Tokens**](../../libs/eco-store/shared/tokens/README.md): Angular DI tokens for shared configuration.

### 🚀 Core Features

- [**Login**](../../libs/eco-store/auth/feature/login/README.md): User authentication and login form.
- [**Formly Integration**](../../libs/eco-store/feature/formly/README.md): Dynamic form generation.
- [**Layout**](../../libs/eco-store/core/layout/README.md): Main application shell and navigation structure.
- [**Entities**](../../libs/eco-store/core/entities/README.md): Shared domain models.
- [**Tenant**](../../libs/eco-store/core/tenant/README.md): Multi-tenancy resolution and configuration.
- [**Core API**](../../libs/eco-store/core/api/data-access/README.md): Base abstract services for tenant-aware API interactions.
- [**Store Window**](../../libs/eco-store/store-window/README.md): Store status and countdown feature.

---

> Part of the [**Plastikspace**](../../README.md) monorepo.
