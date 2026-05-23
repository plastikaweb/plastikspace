# forgot-password

## Table of Contents

- [forgot-password](#forgot-password)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Auth Forgot Password Feature** library provides the password recovery request functionality for the Eco Store application.
It allows users to request a password reset link by providing their email address.

## Features

- **Form Management**: Utilizes `Formly` and the shared authentication form configurations.
- **Service Integration**: Integrates with the authentication facade to handle password recovery requests via the PocketBase backend.
- **Responsive Layout**: Designed to work across mobile and desktop devices.
- **Internationalization**: Fully localized support for labels, placeholders, and error messages.

## Usage

Configure the routes for this feature in your application routing:

```typescript
import { Route } from '@angular/router';
import { ecoStoreAuthForgotPasswordRoutes } from '@plastik/eco-store/auth/forgot-password';

export const routes: Route[] = [
  {
    path: 'forgot-password',
    children: ecoStoreAuthForgotPasswordRoutes,
  },
];
```

## Running unit tests

Run `nx test forgot-password` to execute the unit tests via Vitest.
