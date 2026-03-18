# Eco-Store

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/pocketbase-%23b8dbe4.svg?style=for-the-badge&logo=Pocketbase&logoColor=black)

- [Eco-Store](#eco-store)
  - [Description](#description)
  - [Quick Start](#quick-start)
  - [Development Commands](#development-commands)
  - [Architecture & Libraries](#architecture--libraries)
  - [📖 Documentation](#-documentation)

## Description

**Eco-Store** is a modern consumer cooperative platform designed for sustainable shopping. It features a community-driven commerce model with role-based member management.

Built with **Angular 21** (Signals, Standalone, Control Flow) and **PocketBase**.

## Quick Start

1. **Intelligent Setup**: `yarn install:local`
   - Configures workspace, dependencies, and PocketBase environment.
2. **Start Backend**: `yarn eco-store:pocketbase:run`
3. **Run App**: `yarn eco-store:serve`

## Development Commands

| Task                 | Command                |
| :------------------- | :--------------------- |
| **Serve (Frontend)** | `yarn eco-store:serve` |
| **Full Local Env**   | `yarn eco-store:local` |
| **Build**            | `yarn eco-store:build` |
| **Test**             | `yarn eco-store:test`  |
| **Lint**             | `yarn eco-store:lint`  |
| **E2E Tests**        | `yarn eco-store:e2e`   |
| **Accessibility**    | `yarn eco-store:a11y`  |

## Architecture & Libraries

The application is structured into domain-specific libraries:

### 📦 Products & Orders

- [**Feature List**](../../libs/eco-store/products/feature/list/README.md) / [**Detail**](../../libs/eco-store/products/feature/detail/README.md)
- [**Cart Feature**](../../libs/eco-store/cart/feature/README.md)
- [**Orders Management**](../../libs/eco-store/orders/feature/list/README.md) / [**Confirmation**](../../libs/eco-store/orders/feature/created/README.md)
- [**Data Access**](../../libs/eco-store/products/data-access/README.md) (Products, Cart, Orders, Categories)

### 🚀 Core & Shared

- [**Layout**](../../libs/eco-store/core/layout/README.md): Main shell and navigation.
- [**Tenant**](../../libs/eco-store/core/tenant/README.md): Multi-tenancy resolution.
- [**Auth**](../../libs/eco-store/auth/feature/login/README.md): Login and member authentication.
- [**Shared UI**](../../libs/eco-store/shared/product-card/README.md): Cards, chips, and banners.

---

## 📖 Documentation

- [**Backend Management**](./POCKETBASE.md): PocketBase schema, hooks, and automation guides.
- [**Loading Strategies**](./LOADING_STRATEGIES.md): UI activity patterns and loading states.

---

> Part of the [**Plastikspace**](../../README.md) monorepo.
