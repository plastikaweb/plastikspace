# @plastik/auth/register

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/auth/register](#plastikauthregister)
  - [Description](#description)
  - [Services](#services)
  - [Routes](#routes)
  - [Running unit tests](#running-unit-tests)

## Description

This library handles the **register feature logic**. It provides a concrete implementation of the [`AuthFormFacade`](../../util/README.md) for the registration process.

## Services

- **`RegisterFacadeService`**: Implements `AuthFormFacade`. Manages the registration form state and submission, interacting with the configured `AUTH_SERVICE`.

## Routes

- **`authRegisterFeatureRoutes`**: Routes configuration for the registration flow. It uses the `AuthFeatureComponent` from [`@plastik/auth/util`](../../util/README.md) and provides the necessary tokens:
  - `AUTH_SERVICE`: [`FirebaseAuthService`](../../firebase/data-access/README.md)
  - `AUTH_FORM_FACADE`: `RegisterFacadeService`
  - `FORM_TOKEN`: `registerFormConfig`

## Running unit tests

Run `nx test auth-register-feature` to execute the unit tests.
