# @plastik/eco-store/entities

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

- [@plastik/eco-store/entities](#plastikeco-storeentities)
  - [Description](#description)
  - [Exports](#exports)
    - [Domain Entities](#domain-entities)
    - [Configuration](#configuration)
  - [Related Libraries](#related-libraries)

## Description

This library contains the **eco-store specific entities and type definitions**. It re-exports all PocketBase base types from `@plastik/core/entities` for convenience.

## Exports

### Domain Entities

- **`Product`**: Product entity types and interfaces
- **`ProductCategory`**: Product category entity types and interfaces
- **`EcoStoreTenant`**: Tenant entity for multi-tenancy settings (branding, contacts, etc)

### Configuration

- **`EnvironmentConfiguration`**: Environment configuration types for eco-store

## Related Libraries

- [`@plastik/core/entities`](../../../core/entities/README.md) - Contains `BasePocketBaseEntity` and related types
- [`@plastik/core/util/api-pocketbase`](../../../core/util/api-pocketbase/README.md) - PocketBase CRUD services
- [`@plastik/shared/signal-state/data-access-pocketbase`](../../../shared/signal-state/data-access-pocketbase/README.md) - PocketBase Signal Store features
