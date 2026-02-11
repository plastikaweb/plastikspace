# @plastik/eco-store/core/layout

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/core/layout](#plastikeco-storecorelayout)
  - [Description](#description)
  - [Features](#features)
  - [Route Data Configuration](#route-data-configuration)
  - [Architecture](#architecture)
  - [Usage](#usage)

## Description

This library provides the core layout shell for the Eco Store application. It orchestrates the Header, Sidebar Navigation, Footer, and the main Router Outlet.

## Features

- **Responsive Design**: Automatically handles mobile/desktop navigation via `MatSidenav`.
- **Performance Optimized**:
  - **Eager Header**: The header shell renders immediately to prevent layout shifts.
  - **Lazy Search**: Advanced search configuration uses dynamic imports to reduce initial bundle size.
  - **Cart Animation**: The cart icon animates when the total amount changes.
  - **Isolated Providers**: Exposes `layoutRoutes` to bundle layout-specific dependencies (like `EcoStoreFormlyModule` configurations) separately from the main application entry point.
- **Global Layout Management**: Uses `EcoStoreLayoutService` to dynamically manage global styles (like `body` overflow) based on router configuration.

## Route Data Configuration

The `EcoStoreLayoutService` enables dynamic behavior based on route data. Currently supported flags:

- **`bodyScrollable`**: Boolean. If set to `true`, removes the `overflow-y-hidden` class from the `body` tag. Defaults to `false`.
  Useful for pages like the login form where content might exceed the viewport height on small screens.

Example usage in route definition:

```typescript
{
  path: 'accedir',
  data: { bodyScrollable: true },
  loadChildren: () => import('@plastik/eco-store/auth/login').then(m => m.ecoStoreAuthLoginRoutes),
}
```

## Architecture

The layout is composed of:

- **Header**: Contains the logo, search bar (lazy loaded), and user menu with enhanced authentication state (Login/Profile/Orders/Logout with Avatar or Initials).
- **User Avatar**: Reusable component `UserAvatarComponent` that handles displaying user avatar or initials.
- **Menu**: Navigation menu with role-based icons:
  - `PARTNER`: verified icon
  - `GLOBAL_ADMIN`: admin_panel_settings icon
  - `TENANT_ADMIN`: manage_accounts icon
- **Sidenav**: Collapsible navigation menu for categories and account links.
- **Content**: The main `router-outlet` for feature modules.
- **Footer**: Application footer.

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
