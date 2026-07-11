# reset-password

## Table of Contents

- [reset-password](#reset-password)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Auth Reset Password Feature** library provides the password reset functionality for the Eco Store application.
It handles the secure submission of new passwords for users who have received a valid reset token.

## Features

- **Form Management**: Utilizes `Formly` and the shared authentication form configurations.
- **Token Validation**: Automatically retrieves the reset token from the URL for backend verification.
- **Password Matching**: Includes validation to ensure the new password and its confirmation match.
- **Security**: Designed for standalone components and integrates with modern Angular reactive patterns.
- **Internationalization**: Fully localized support for all UI labels and validation messages.

## Usage

Configure the routes for this feature in your application routing:

```typescript
import { Route } from '@angular/router';
import { ecoStoreAuthResetPasswordRoutes } from '@plastik/eco-store/auth/reset-password';

export const routes: Route[] = [
  {
    path: 'reset-password',
    children: ecoStoreAuthResetPasswordRoutes,
  },
];
```

## Running unit tests

Run `nx test reset-password` to execute the unit tests via Vitest.
