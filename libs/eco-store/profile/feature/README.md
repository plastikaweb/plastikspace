# 👤 Eco-Store Profile Feature

- [👤 Eco-Store Profile Feature](#-eco-store-profile-feature)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Usage](#usage)
  - [Running unit tests](#running-unit-tests)

## Introduction

This library provides the profile management feature for the Eco-Store application. It includes components and services for managing user personal data, addressing, and other configuration options.

## Features

- **Personal Data**: View and edit basic profile information.
- **Responsive Layout**: Sidebar navigation on desktop and mobile-friendly layouts for smaller screens.
- **Formly Integration**: Leverages `@plastik/shared/form` for flexible, reactive forms.

## Usage

This feature is designed to be lazy-loaded via the Angular Router in the main `eco-store` application:

```ts
{
  path: 'perfil',
  loadChildren: () => import('@plastik/eco-store/profile/feature').then(m => m.ecoStoreProfileFeatureRoutes)
}
```

## Running unit tests

Run `nx test eco-store-profile-feature` to execute the unit tests via Vitest.
