# @plastik/shared/auth/request-password/feature

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/auth/request-password/feature](#plastiksharedauthrequest-passwordfeature)
  - [Description](#description)
  - [Components](#components)
  - [Routes](#routes)
  - [Running unit tests](#running-unit-tests)

## Description

This library is responsible for handling all the **request password feature logic**.

## Components

- `AuthFeatureComponent`: This component is the main container for the request password feature.

## Routes

- `authRequestPasswordRoutes`: This route is responsible for displaying the request password component.
  It uses by default the `FirebaseAuthService` to handle the authentication and the `RequestPasswordFacadeService` to handle the request password UI and behavior.
  It uses by default the `getRequestPasswordFormConfig()` to get the request password form config.

## Running unit tests

Run `nx test auth-request-password` to execute the unit tests.
