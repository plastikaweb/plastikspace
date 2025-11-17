# Eco-Store

- [Eco-Store](#eco-store)
  - [Description](#description)
  - [Running commands](#running-commands)
    - [Development](#development)
    - [With PocketBase](#with-pocketbase)
    - [PocketBase](#pocketbase)
    - [Testing \& Quality](#testing--quality)
    - [Build \& Deploy](#build--deploy)
    - [Accessibility](#accessibility)
  - [Available libraries](#available-libraries)
    - [Entities](#entities)
    - [Product Categories](#product-categories)
    - [Features](#features)

## Description

Eco-Store is an online cooperative store that enables members to purchase ecological and local products sustainably.
The platform facilitates the management of a consumer cooperative with different user levels and functionalities adapted to cooperative needs.

The application uses PocketBase as backend and is built with Angular 20+ with the latest features like signals, standalone components, and the new control flow system.

## Running commands

### Development

- **Serve (development)**: Run `yarn eco-store:serve`
- **Serve (staging)**: Run `yarn eco-store:serve:staging`
- **Serve (production)**: Run `yarn eco-store:serve:prod`

### With PocketBase

- **Local with PocketBase (development)**: Run `yarn eco-store:local`
- **Local with PocketBase (staging)**: Run `yarn eco-store:local:staging`
- **Local with PocketBase (production)**: Run `yarn eco-store:local:prod`

### PocketBase

- **Start PocketBase**: Run `yarn eco-store:pocketbase:run`
- **Stop PocketBase**: Run `yarn eco-store:pocketbase:stop`

### Testing & Quality

- **Lint**: Run `yarn eco-store:lint`
- **Test**: Run `yarn eco-store:test`
- **E2E**: Run `yarn eco-store:e2e`
- **E2E (local)**: Run `yarn eco-store:e2e:local`

### Build & Deploy

- **Build**: Run `yarn eco-store:build`
- **Build (GitHub)**: Run `yarn eco-store:build:github`
- **HTTP Server**: Run `yarn eco-store:http-server`

### Accessibility

- **A11y Check**: Run `yarn eco-store:a11y`

## Available libraries

This is a list of all the related libraries to eco-store app.

### Entities

- [eco-store-entities](../../libs/eco-store/entities/README.md)

### Product Categories

- [eco-store-product-categories-data-access](../../libs/eco-store/product-categories/data-access/README.md)

### Features

- [eco-store-feature-formly](../../libs/eco-store/feature/formly/README.md)
