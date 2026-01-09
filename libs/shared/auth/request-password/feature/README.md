# @plastik/auth/request-password

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/auth/request-password](#plastikauthrequest-password)
  - [Description](#description)
  - [Services](#services)
  - [Routes](#routes)
  - [Running unit tests](#running-unit-tests)

## Description

This library handles the **request password feature logic**. It provides a concrete implementation of the [`AuthFormFacade`](../../feature/README.md) for the "forgot password" process.

## Services

- **`RequestPasswordFacadeService`**: Implements `AuthFormFacade`. Manages the request password form state and submission, interacting with the configured `AUTH_SERVICE`.

## Routes

- **`authRequestPasswordRoutes`**: Routes configuration for the request password flow.
  It uses the `AuthFeatureComponent` from [`@plastik/shared/auth/feature`](../../feature/README.md)
  and provides the necessary tokens:
  - `AUTH_SERVICE`: [`FirebaseAuthService`](../../firebase/data-access/README.md)
  - `AUTH_FORM_FACADE`: `RequestPasswordFacadeService`
  - `FORM_TOKEN`: `requestPasswordFormConfig`

## Running unit tests

Run `nx test auth-request-password` to execute the unit tests.
