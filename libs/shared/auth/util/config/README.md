# plastik-auth-config-util

## Table of Contents

- [plastik-auth-config-util](#plastik-auth-config-util)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

The **Shared Auth Config Util** library provides centralized Formly configurations for authentication-related forms across the application.
It ensures consistent form structures and validation rules for login, registration, and password recovery processes.

## Usage

This library exports form configuration functions that can be injected or provided to authentication components.

- `loginFormConfig()`: Returns Formly configuration for the login form.
- `requestPasswordFormConfig()`: Returns Formly configuration for the "forgot password" form.
- `resetPasswordFormConfig()`: Returns Formly configuration for the password reset form.

These configurations are designed to be used with `@plastik/shared/form` and integrate with shared validation and translation systems.

## Running unit tests

Run `nx test plastik-auth-config-util` to execute the unit tests via Vitest.
