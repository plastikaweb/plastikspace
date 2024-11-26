# auth-request-password

- [auth-request-password](#auth-request-password)
  - [Description](#description)
  - [Components](#components)
  - [Routes](#routes)
  - [Running unit tests](#running-unit-tests)

## Description

This library is responsible for handling all the request password feature logic.

## Components

- `AuthFeatureComponent`: This component is the main container for the request password feature.

## Routes

- `authRequestPasswordRoutes`: This route is responsible for displaying the request password component.
  It uses by default the `FirebaseAuthService` to handle the authentication and the `RequestPasswordFacadeService` to handle the request password UI and behavior.
  It uses by default the `getRequestPasswordFormConfig()` to get the request password form config.

## Running unit tests

Run `nx test auth-request-password` to execute the unit tests.
