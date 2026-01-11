# @plastik/eco-store/core/layout

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/core/layout](#plastikeco-storecorelayout)
  - [Description](#description)
  - [Features](#features)
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

## Architecture

The layout is composed of:

- **Header**: Contains the logo, search bar (lazy loaded), and user menu with enhanced authentication state (Login/Profile/Orders/Logout with Avatar or Initials).
- **User Avatar**: Reusable component `UserAvatarComponent` that handles displaying user avatar or initials.
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
