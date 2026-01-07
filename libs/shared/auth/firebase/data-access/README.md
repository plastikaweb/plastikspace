# @plastik/auth/firebase/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

- [@plastik/auth/firebase/data-access](#plastikauthfirebasedata-access)
  - [Description](#description)
  - [Services](#services)
  - [Guards](#guards)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides the **Firebase implementation** of the authentication logic. It implements the `AuthFacade` contract defined in [`@plastik/shared/auth/feature`](../../feature/README.md).

## Services

- **`FirebaseAuthService`**: Implements `AuthFacade`. Includes logic for:
  - `login`: Logs in the user with email and password.
  - `register`: Registers the user with email and password.
  - `logout`: Logs out the user.
  - `sendVerification`: Sends a verification email.
  - `requestPassword`: Sends a password reset email.

## Guards

- **`isAdminGuard`**: Checks if the user is an admin.
- **`isLoggedGuard`**: Checks if the user is logged in.
- **`isNotLoggedGuard`**: Checks if the user is not logged in.

## Running unit tests

Run `nx test auth-firebase-data-access` to execute the unit tests.
