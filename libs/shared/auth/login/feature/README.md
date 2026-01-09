# @plastik/auth/login

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/auth/login](#plastikauthlogin)
  - [Description](#description)
  - [Services](#services)
  - [Routes](#routes)
  - [Running unit tests](#running-unit-tests)

## Description

This library handles the **login feature logic**. It provides a concrete implementation of the [`AuthFormFacade`](../../feature/README.md) for the login process.

## Services

- **`LoginFacadeService`**: Implements `AuthFormFacade`. Manages the login form state and submission, interacting with the configured `AUTH_SERVICE`.

## Routes

- **`firebaseAuthLoginFeatureRoutes`**: Routes configuration for the Firebase login flow. It uses the `AuthFeatureComponent` from [`@plastik/shared/auth/feature`](../../feature/README.md) and provides the necessary tokens:
  - `AUTH_SERVICE`: [`FirebaseAuthService`](../../firebase/data-access/README.md)
  - `AUTH_FORM_FACADE`: `LoginFacadeService`
  - `FORM_TOKEN`: `loginFormConfig`

## Running unit tests

Run `nx test auth-login-feature` to execute the unit tests.
