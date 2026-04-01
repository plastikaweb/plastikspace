# auth-container

## Table of Contents

- [auth-container](#auth-container)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Auth Container** library provides a shared visual container for authentication-related pages in the Eco Store application.
It ensures a consistent layout, branding, and loading state across login, registration, and password recovery views.

## Features

- **Branding**: Displays the tenant's logo and slogan.
- **Loading State**: Provides a visual indicator (`mat-progress-bar`) during authentication activities.
- **PWA Navigation**: Conditionally displays a "Back" button for iOS standalone mode, ensuring users can return to the store.
- **Content Projection**: Uses `<ng-content>` to display page-specific titles and form content.

## Usage

This component is typically used as a wrapper in individual authentication feature components:

```html
<eco-store-auth-container [isLoading]="facade.isLoading?.() ?? false">
  <span title>{{ 'auth.login.title' | translate }}</span>
  <div content>
    <!-- Feature-specific form -->
  </div>
</eco-store-auth-container>
```

## Running unit tests

Run `nx test auth-container` to execute the unit tests via Vitest.
