# Eco-Store

## An online cooperative store for sustainable and local products

- [Eco-Store](#eco-store)
  - [An online cooperative store for sustainable and local products](#an-online-cooperative-store-for-sustainable-and-local-products)
  - [📝 Description](#-description)
  - [🛠️ Running Commands](#️-running-commands)
    - [Development](#development)
    - [With PocketBase (Local)](#with-pocketbase-local)
    - [PocketBase Management](#pocketbase-management)
    - [Testing \& Quality](#testing--quality)
    - [Build \& Deploy](#build--deploy)
    - [Accessibility](#accessibility)
  - [📚 Available Libraries](#-available-libraries)
    - [🧩 Entities](#-entities)
    - [📦 Products](#-products)
    - [🚀 Features](#-features)

---

## 📝 Description

**Eco-Store** enables members to purchase ecological and local products sustainably.
The platform facilitates the management of a consumer cooperative with different user levels and functionalities adapted to cooperative needs.

**Tech Stack:**

- **Frontend**: Angular 20+ (Signals, Standalone Components, Control Flow)
- **Backend**: PocketBase
- **State Management**: NgRx Signal Store

## 🛠️ Running Commands

### Development

- **Serve (Dev)**: `yarn eco-store:serve`
- **Serve (Staging)**: `yarn eco-store:serve:staging`
- **Serve (Prod)**: `yarn eco-store:serve:prod`

### With PocketBase (Local)

- **Dev**: `yarn eco-store:local`
- **Staging**: `yarn eco-store:local:staging`
- **Prod**: `yarn eco-store:local:prod`

### PocketBase Management

- **Start**: `yarn eco-store:pocketbase:run`
- **Stop**: `yarn eco-store:pocketbase:stop`
- **Export Schema**: `yarn pb:export`

📖 **[PocketBase Schema Management Guide](./POCKETBASE_SCHEMA_MANAGEMENT.md)** - Best practices for managing schema changes

**Related Resources:**

- [Schema File](./pocketbase/pb_schema.json)
- [Sync Script](./scripts/sync-pocketbase-schema.js)
- [Export Script](./scripts/export-pocketbase-schema.js)
- [GitHub Workflow](../../.github/workflows/pocketbase-schema.yml)

### Testing & Quality

- **Lint**: `yarn eco-store:lint`
- **Test**: `yarn eco-store:test`
- **E2E**: `yarn eco-store:e2e`
- **E2E (Local)**: `yarn eco-store:e2e:local`

### Build & Deploy

- **Build**: `yarn eco-store:build`
- **Build (GitHub)**: `yarn eco-store:build:github`
- **HTTP Server**: `yarn eco-store:http-server`

### Accessibility

- **A11y Check**: `yarn eco-store:a11y`

## 📚 Available Libraries

### 🧩 Entities

- [**eco-store-entities**](../../libs/eco-store/entities/README.md)

### 📦 Products

- [**products-data-access**](../../libs/eco-store/products/data-access/README.md)
- [**product-categories-data-access**](../../libs/eco-store/product-categories/data-access/README.md)

### 🚀 Features

- [**feature-formly**](../../libs/eco-store/feature/formly/README.md)
