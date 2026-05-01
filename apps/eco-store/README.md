# Eco-Store

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![PocketBase](https://img.shields.io/badge/pocketbase-%23b8dbe4.svg?style=for-the-badge&logo=Pocketbase&logoColor=black)

- [Eco-Store](#eco-store)
  - [Description](#description)
  - [Quick Start](#quick-start)
  - [Development Commands](#development-commands)
  - [Architecture \& Libraries](#architecture--libraries)
    - [📦 Products](#-products)
    - [🛒 Cart](#-cart)
    - [🧾 Orders](#-orders)
    - [🚀 Core \& Shared](#-core--shared)
  - [Theming \& Design](#theming--design)
    - [🎨 Light \& Dark Modes](#-light--dark-modes)
    - [🖋️ Editorial Typography](#️-editorial-typography)
  - [📖 Documentation](#-documentation)

## Description

**Eco-Store** is a modern consumer cooperative platform designed for sustainable shopping. It features a community-driven commerce model with role-based member management.

Built with **Angular 21** (Signals, Standalone, Control Flow) and **PocketBase**.

## Quick Start

1. **Intelligent Setup**: `node tools/scripts/setup-local.js`
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

### 📦 Products

- [**Feature List**](../../libs/eco-store/products/feature/list/README.md) / [**Detail**](../../libs/eco-store/products/feature/detail/README.md)
- [**Data Access**](../../libs/eco-store/products/data-access/README.md)

### 🛒 Cart

- [**Cart Feature**](../../libs/eco-store/cart/feature/README.md)
- [**Data Access**](../../libs/eco-store/cart/data-access/README.md)

### 🧾 Orders

- [**Data Access**](../../libs/eco-store/orders/data-access/README.md)
- [**Orders List**](../../libs/eco-store/orders/feature/list/README.md)
- [**Order Detail**](../../libs/eco-store/orders/feature/detail/README.md)
- [**Order Confirmation**](../../libs/eco-store/orders/feature/created/README.md)

### 🚀 Core & Shared

- [**Layout**](../../libs/eco-store/core/layout/README.md): Main shell and navigation.
- [**Tenant**](../../libs/eco-store/core/tenant/README.md): Multi-tenancy resolution.
- [**Auth**](../../libs/eco-store/auth/feature/login/README.md): Login and member authentication.
- [**Profile**](../../libs/eco-store/profile/feature/README.md): User personal data, addresses, and account management.
- [**Shared UI**](../../libs/eco-store/shared/product-card/README.md): Cards, chips, and banners.
- [**Breadcrumbs**](../../libs/eco-store/shared/breadcrumbs/README.md): Responsive breadcrumb navigation bar with back button, skeleton states, and i18n support used across detail views.
- [**Hero Header**](../../libs/eco-store/shared/hero-header/README.md): Shared page header with organic background, responsive typography, and content projection slots used across views.
- [**Price Summary**](../../libs/eco-store/shared/price-summary/README.md): Reusable price summary card (subtotal, taxes, shipping, total) used across cart steps and orders detail.
- [**Translation**](../../libs/shared/translation/README.md): Centralized language management.

---

## Theming & Design

Eco-Store implements a robust, mode-aware design system based on the **"Organic and Kind"** aesthetic principle.

### 🎨 Light & Dark Modes

The application features a fully integrated Light and Dark mode experience, accessible via the theme toggle in the header.

- **Organic Foundations**: Uses **OKLCH-derived color scales** for perceptually uniform palettes that maintain the "Kind" personality across both modes.
- **Glassmorphism**: Headers and mobile navigation leverage advanced glassmorphism (`backdrop-blur-xl`) with mode-aware opacity and tinting to ensure high contrast and lightness.
- **Earthy Neutrals**: Surfaces use tinted neutrals rather than pure grays, providing a warmer, more approachable feel that aligns with the cooperative's values.
- **High-Impact Interactions**: Hover states and "Overdrive" animations (scale, blur reveals, organic glows) are optimized for both themes to provide delightful feedback.

### 🖋️ Editorial Typography

A strong typographic hierarchy is maintained using **Manrope**, with specialized tracking and weights for "Editorial" components, ensuring legibility and character in any environment.

## 📖 Documentation

- [**Backend Management**](./POCKETBASE.md): PocketBase schema, hooks, and automation guides.
- [**Loading Strategies**](./LOADING_STRATEGIES.md): UI activity patterns and loading states.
- [**SSR Implementation**](./SSR.md): Server-Side Rendering configuration and deployment.

---

> Part of the [**Plastikspace**](../../README.md) monorepo.
