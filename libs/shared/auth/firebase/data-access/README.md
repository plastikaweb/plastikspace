# @plastik/shared/auth/firebase/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

- [@plastik/shared/auth/firebase/data-access](#plastiksharedauthfirebasedata-access)
  - [Description](#description)
  - [Services](#services)
  - [Guards](#guards)
  - [Running unit tests](#running-unit-tests)

## Description

This library is responsible for handling all the data access logic for the **Firebase Authentication**.

## Services

- **`FirebaseAuthService`**: Handles all authentication logic.
  - `login`: Logs in the user with email and password.
  - `register`: Registers the user with email and password.
  - `logout`: Logs out the user.
  - `sendVerification`: Sends a verification email.
  - `requestPassword`: Sends a password reset email.
  - `handleAuthStateChanged`: Handles auth state changes.
  - `resetAuth`: Resets the authentication state.

## Guards

- **`isAdminGuard`**: Checks if the user is an admin.
- **`isLoggedGuard`**: Checks if the user is logged in.
- **`isNotLoggedGuard`**: Checks if the user is not logged in.

## Running unit tests

Run `nx test shared-auth-firebase-data-access` to execute the unit tests.
