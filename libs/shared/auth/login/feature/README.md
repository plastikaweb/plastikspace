# @plastik/shared/auth/login/feature

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/auth/login/feature](#plastiksharedauthloginfeature)
  - [Description](#description)
  - [Components](#components)
  - [Routes](#routes)
  - [Running unit tests](#running-unit-tests)

## Description

This library is responsible for handling all the **login feature logic**.

## Components

- `AuthFeatureComponent`: This component is the main container for the login feature.

## Routes

- `authLoginFeatureRoutes`: This route is responsible for displaying the login component.
  It uses by default the `FirebaseAuthService` to handle the authentication and the `LoginFacadeService` to handle the login UI and behavior.
  It uses by default the `getLoginFormConfig()` to get the login form config.

## Running unit tests

Run `nx test auth-login-feature` to execute the unit tests.
