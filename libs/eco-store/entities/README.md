# Eco-store entities

- [Eco-store entities](#eco-store-entities)
  - [Description](#description)
  - [📦 Exports](#-exports)
    - [Domain Entities](#domain-entities)
    - [Configuration](#configuration)
  - [🔗 Related Libraries](#-related-libraries)

## Description

This library contains the eco-store specific entities and type definitions. It re-exports all PocketBase base types from `@plastik/core/entities` for convenience.

## 📦 Exports

### Domain Entities

- **`Product`**: Product entity types and interfaces
- **`ProductCategory`**: Product category entity types and interfaces

### Configuration

- **`EnvironmentConfiguration`**: Environment configuration types for eco-store

## 🔗 Related Libraries

- [`@plastik/core/entities`](../../core/entities/README.md) - Contains `BasePocketBaseEntity` and related types
- [`@plastik/core/api-pocketbase`](../../core/util/api-pocketbase/README.md) - PocketBase CRUD services
- [`@plastik/shared/signal-state/data-access-pocketbase`](../../shared/signal-state/data-access-pocketbase/README.md) - PocketBase Signal Store features

---

Generated with [Nx](https://nx.dev).
