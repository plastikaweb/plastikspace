# @plastik/eco-store/auth/feature/login

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Material](https://img.shields.io/badge/material_ui-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/auth/feature/login](#plastikeco-storeauthfeaturelogin)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Route Configuration](#route-configuration)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Auth Login Feature** library provides the login page functionality for the Eco Store application.
It integrates with the shared authentication infrastructure and provides a user-friendly form for user sign-in.

## Features

- **Form Management**: Utilizes `Formly` and shared form infrastructure for robust form handling.
- **Password Visibility**: Includes a toggle to show/hide password text.
- **Authentication Guards**: Integrated with `pocketBaseIsNotLoggedGuard` to prevent access if already logged in.
- **Material Design**: Built with Angular Material components (`MatCard`, `MatButton`, etc.).
- **Internationalization**: Supports translation via `@ngx-translate/core`. The login route uses a `title: 'auth.login.title'` key resolved reactively by `EcoStorePrefixTitleService`.
- **Tenant Branding**: Dynamically displays the tenant's logo, name, and slogan.

## Installation

This library is part of the `@plastik/eco-store` scope. Import the routes in your application routing configuration.

## Usage

### Route Configuration

Import the `ecoStoreAuthLoginRoutes` and configure it in your application's routing module.

```typescript
import { Route } from '@angular/router';
import { ecoStoreAuthLoginRoutes } from '@plastik/eco-store/auth/login';

export const routes: Route[] = [
  {
    path: 'login',
    children: ecoStoreAuthLoginRoutes,
  },
];
```

## Running unit tests

Run `nx test eco-store-auth-feature-login` to execute the unit tests via Jest.
