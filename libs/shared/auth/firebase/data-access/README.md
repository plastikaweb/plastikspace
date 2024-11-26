# auth-firebase-data-access

- [auth-firebase-data-access](#auth-firebase-data-access)
  - [Description](#description)
  - [Services](#services)
  - [Guards](#guards)
  - [Running unit tests](#running-unit-tests)

## Description

This library is responsible for handling all the data access logic for the firebase authentication.

## Services

- `FirebaseAuthService`: This service is responsible for handling all the authentication logic.
  - `login`: This method is responsible for logging in the user with email and password.
  - `register`: This method is responsible for registering the user with email and password.
  - `logout`: This method is responsible for logging out the user.
  - `sendVerification`: This method is responsible for sending a verification email.
  - `requestPassword`: This method is responsible for sending a password reset email.
  - `handleAuthStateChanged`: This method is responsible for handling the auth state changes.

## Guards

- `isAdminGuard`: This guard is responsible for checking if the user is an admin.
- `isLoggedGuard`: This guard is responsible for checking if the user is logged in.
- `isNotLoggedGuard`: This guard is responsible for checking if the user is not logged in.

## Running unit tests

Run `nx test auth-firebase-data-access` to execute the unit tests.
