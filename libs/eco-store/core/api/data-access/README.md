# @plastik/eco-store/core/api/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/core/api/data-access](#plastikeco-storecoreapidata-access)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
    - [EcoStoreGetAllService](#ecostoregetallservice)
    - [EcoStoreGetService](#ecostoregetservice)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides base abstract services for interacting with the backend (PocketBase) in a multi-tenant environment.
It abstracts common patterns for fetching data while automatically handling tenant context resolution via `ecoStoreTenantStore`.

## Features

- **Tenant Injection**: Automatically provides access to `ecoStoreTenantStore` via `this.tenantStore`.
- **Enforced Filtering**: Requires implementation of `filter` to ensure developers consider multi-tenancy in all API calls.
- **Automatic Tenant Context for CRUD**: `EcoStoreCrudService` automatically injects the tenant ID into `create` and `update` payloads.
- **PocketBase Integration**: Built on top of `@plastik/core/api-pocketbase` to provide standard CRUD operations.
- **Type Safety**: Strongly typed generics for entities ensuring type safety across the application.

## Usage

### EcoStoreGetAllService

An abstract base service extending `PocketBaseGetAllService`. It is designed for services that need to fetch lists of items scoped to the current tenant.

**Example Implementation:**

```typescript
@Injectable({ providedIn: 'root' })
export class MyEntityApiService extends EcoStoreGetAllService<MyEntity> {
  protected override collectionName(): string {
    return 'my_collection';
  }

  get filter(): string {
    return `tenant = "${this.tenantStore.tenant()?.id}"`;
  }
}
```

### EcoStoreGetService

An abstract base service extending `PocketBaseGetService`. Use this for services that require fetching single items or lists, with automatic tenant context injection.

**Example Implementation:**

````typescript
@Injectable({ providedIn: 'root' })
export class MyEntityApiService extends EcoStoreGetService<MyEntity> {
  protected override collectionName(): string {
    return 'my_collection';
  }

  get filter(): string {
    return `tenant = "${this.tenantStore.tenant()?.id}"`;
  }
}
### EcoStoreCrudService

An abstract base service extending `PocketBaseCrudService`. It provides full CRUD capabilities and automatically handles tenant ID injection for `create` and `update` operations.

**Example Implementation:**

```typescript
@Injectable({ providedIn: 'root' })
export class MyEntityApiService extends EcoStoreCrudService<MyEntity> {
  protected override collectionName(): string {
    return 'my_collection';
  }

  // filter is still required for get/list operations
  get filter(): string {
    return `tenant = "${this.tenantStore.tenant()?.id}"`;
  }
}
````

## Running unit tests

Run `nx test eco-store-core-api-data-access` to execute the unit tests via Jest.
