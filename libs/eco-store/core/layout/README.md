# @plastik/eco-store/core/layout

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/core/layout](#plastikeco-storecorelayout)
  - [Description](#description)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Usage](#usage)
  - [View Transitions](#view-transitions)

## Description

This library provides the core layout shell for the Eco Store application. It orchestrates the Header, Sidebar Navigation, Footer, and the main Router Outlet.

## Features

- **Responsive Design**: Automatically handles mobile/desktop navigation via `MatSidenav`.
- **Performance Optimized**:
  - **Eager Header**: The header shell renders immediately to prevent layout shifts.
  - **Lazy Search**: Advanced search configuration uses dynamic imports to reduce initial bundle size.
  - **Cart Animation**: The cart icon animates when the total amount changes.
  - **Isolated Providers**: Exposes `layoutRoutes` to bundle layout-specific dependencies (like `EcoStoreFormlyModule` configurations) separately from the main application entry point.
- **Global Layout Management**: Uses `EcoStoreLayoutService` to dynamically manage global styles and `BodyBackgroundService` to automatically manage decorative backgrounds.
- **Smart Scrolling**: Automatically scrolls to the top of the content area or the window on navigation events using modern Angular `afterNextRender` hooks for optimal performance.

## Architecture

The layout is composed of:

- **Header**: Contains the Logo/Title (via `TenantLogoComponent` and `TenantLinkComponent`), search bar (lazy loaded), and the Store Window status.
- **Tenant Logo/Link**: Reusable components for consistent branding and home navigation.
- **User Avatar**: Reusable component `UserAvatarComponent` that handles displaying user avatar or initials.
- **Menu**: Navigation menu with role-based icons:
  - `PARTNER`: verified icon
  - `GLOBAL_ADMIN`: admin_panel_settings icon
  - `TENANT_ADMIN`: manage_accounts icon
- **Sidenav**: Collapsible navigation menu for categories and account links.
- **Content**: The main `router-outlet` for feature modules.
- **Footer**: Application footer.
- **EcoStoreLayoutService**: A reactive service that manages global layout properties and handles side effects like body overflow and scroll-to-top on navigation.
- **BodyBackgroundService**: A reactive service using Angular Signals that listens to route changes and applies contextual classes to the `body` tag for background illustrations.

## Usage

Import the routes in your application's routing configuration to enable lazy loading of the entire layout bundle:

```typescript
// app.routes.ts
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@plastik/eco-store/layout').then(m => m.layoutRoutes),
  },
];
```

## View Transitions

This module incorporates smooth CSS view transitions to provide a seamless and visually appealing user experience during interactions and navigation.
