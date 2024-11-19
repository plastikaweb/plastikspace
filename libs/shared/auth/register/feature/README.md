# auth-register-feature

- [auth-register-feature](#auth-register-feature)
  - [Description](#description)
  - [Components](#components)
  - [Routes](#routes)
  - [Running unit tests](#running-unit-tests)

## Description

This library is responsible for handling all the register feature logic.

## Components

- `AuthFeatureComponent`: This component is the main container for the register feature.

## Routes

- `authRegisterFeatureRoutes`: This route is responsible for displaying the register component.
  It uses by default the `FirebaseAuthService` to handle the authentication and the `RegisterFacadeService` to handle the register UI and behavior.
  It uses by default the `getRegisterFormConfig()` to get the register form config.

## Running unit tests

Run `nx test auth-register-feature` to execute the unit tests.
