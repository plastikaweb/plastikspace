# core-util-api

- [core-util-api](#core-util-api)
  - [Description](#description)
  - [Quick Start - Unified CRUD Architecture](#quick-start---unified-crud-architecture)
  - [Architecture Overview](#architecture-overview)
  - [Core building blocks](#core-building-blocks)
  - [CRUD service interfaces](#crud-service-interfaces)
  - [Unified CRUD Architecture](#unified-crud-architecture)
    - [Unified interfaces](#unified-interfaces)
    - [Provider adapters](#provider-adapters)
      - [HttpUnifiedService](#httpunifiedservice)
      - [PocketBaseUnifiedService](#pocketbaseunifiedservice)
    - [Factory configuration](#factory-configuration)
    - [Usage example](#usage-example)
  - [Token factories](#token-factories)
  - [Providing a REST implementation](#providing-a-rest-implementation)
  - [Providing a PocketBase implementation](#providing-a-pocketbase-implementation)
  - [Consuming CRUD services](#consuming-crud-services)
  - [Testing](#testing)

## Description

Utilities to create strongly typed CRUD data services with **unified architecture** for seamless provider switching between HTTP and PocketBase.
Choose your data provider through configuration without changing your application code.

## Quick Start - Unified CRUD Architecture

```typescript
import {
  HttpUnifiedService,
  PocketBaseUnifiedService,
  DataProvider,
  createCrudProviders,
} from '@plastik/core/util/api';

// 1. Create your HTTP implementation
@Injectable()
class ProductHttpService extends HttpUnifiedService<Product, string> {
  protected resourceUrlSegment(): string {
    return 'products';
  }
}

// 2. Create your PocketBase implementation
@Injectable()
class ProductPocketBaseService extends PocketBaseUnifiedService<Product, string> {
  protected collectionName(): string {
    return 'products';
  }
}

// 3. Configure providers to switch between HTTP/PocketBase
export const PRODUCT_PROVIDERS = createCrudProviders<Product, string>(
  'Product',
  ProductHttpService,
  ProductPocketBaseService,
  { provider: DataProvider.POCKETBASE } // Change to HTTP or POCKETBASE
);
```

## Architecture Overview

```bash
📦 Unified CRUD Architecture (Recommended)
├─ CrudApiService<T> - Unified interface for all CRUD operations
├─ HttpUnifiedService<T, ID> - HTTP adapter implementation
└─ PocketBaseUnifiedService<T, ID> - PocketBase adapter implementation

📦 Legacy Services (For backward compatibility)
├─ BaseDataService - Common error handling and environment access
├─ HTTP Services - Individual HTTP CRUD services
└─ PocketBase Services - Individual PocketBase CRUD services
```

## Core building blocks

| Element                    | Location                        | Responsibility                                                                |
| -------------------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| `BaseDataService`          | `base-data.service.ts`          | Provides environment access and a shared error handler.                       |
| `ApiService`               | `api.service.ts`                | Base class for REST/HTTP CRUD flows with caching and mapping hooks.           |
| `HttpUnifiedService`       | `http-unified.adapter.ts`       | New unified base class for HTTP with provider-agnostic interface.             |
| `PocketBaseService`        | `pocketbase.service.ts`         | Base class for PocketBase CRUD flows reusing the same CRUD contract.          |
| `PocketBaseUnifiedService` | `pocketbase-unified.adapter.ts` | New unified base class for PocketBase with provider-agnostic interface.       |
| `Data*Service` interfaces  | `data-crud.ts`                  | Contracts defining the capabilities expected from CRUD services.              |
| `I*Service` interfaces     | `data-crud-unified.ts`          | New unified contracts for provider-agnostic CRUD operations.                  |
| Token factories            | `data-crud.tokens.ts`           | Helpers to create feature-specific injection tokens for each CRUD capability. |
| `createCrudProviders`      | `crud-provider.factory.ts`      | New factory for creating providers based on configuration.                    |

## CRUD service interfaces

Each interface focuses on a single capability; compose them to match your feature needs.

| Interface                                              | Required methods                              | Typical payload                                |
| ------------------------------------------------------ | --------------------------------------------- | ---------------------------------------------- |
| `DataGetListService<TList, P>`                         | `getList(params?: P)`                         | List DTOs (arrays, pagination wrappers, etc.). |
| `DataGetOneService<TEntity, ID, ReadOptions>`          | `getOne(id, options?)`                        | Single entity retrieval.                       |
| `DataCreateService<TEntity, Create, WriteOptions>`     | `create(data, options?)`                      | Create mutations returning the saved entity.   |
| `DataUpdateService<TEntity, ID, Update, WriteOptions>` | `update(id, data, options?)`                  | Update mutations returning the updated entity. |
| `DataDeleteService<ID>`                                | `delete(id)`                                  | Boolean deletion acknowledgement.              |
| `DataReadService`                                      | Combines list + single item read operations.  |                                                |
| `DataWriteService`                                     | Combines create + update + delete operations. |                                                |
| `DataCrudService`                                      | Full CRUD (read + write).                     |                                                |

Default tokens (`DATA_*_SERVICE`) are exported in `data-crud.ts` for quick wiring when only one implementation exists.

## Unified CRUD Architecture

The new unified architecture allows you to switch between HTTP and PocketBase providers without changing your business logic code.

### Unified interfaces

Located in `data-crud-unified.ts`, these interfaces provide a consistent API regardless of the underlying provider:

| Interface           | Methods                                                      |
| ------------------- | ------------------------------------------------------------ |
| `IGetAll<T>`        | `getList(params?)`, `getFullList(params?)`                   |
| `IGetOneService<T>` | `getOne(id, options?)`, `getFirstListItem(filter, options?)` |
| `ICreateService<T>` | `create(data, options?)`                                     |
| `IUpdateService<T>` | `update(id, data, options?)`                                 |
| `IDeleteService<T>` | `delete(id)`                                                 |
| `CrudApiService<T>` | Combines all unified interfaces                              |

### Provider adapters

#### HttpUnifiedService

```typescript
@Injectable()
export class MyEntityHttpService extends HttpUnifiedService<MyEntity, string> {
  protected resourceUrlSegment(): string {
    return 'my-entities';
  }
}
```

#### PocketBaseUnifiedService

```typescript
@Injectable()
export class MyEntityPocketBaseService extends PocketBaseUnifiedService<MyEntity, string> {
  protected collectionName(): string {
    return 'my_entities';
  }
}
```

### Factory configuration

Use the factory to create providers that can switch based on configuration:

```typescript
const MY_ENTITY_PROVIDERS = createCrudProviders<MyEntity, string>(
  'MyEntity',
  MyEntityHttpService,
  MyEntityPocketBaseService,
  {
    provider: DataProvider.HTTP, // or DataProvider.POCKETBASE
    options: {
      http: { baseUrl: environment.baseApiUrl },
      pocketbase: { enableRealtime: true, cacheTime: 300000 },
    },
  }
);
```

### Usage example

```typescript
@Component({
  providers: MY_ENTITY_PROVIDERS,
})
export class MyComponent {
  constructor(private entityService: CrudApiService<MyEntity>) {}

  loadEntities() {
    this.entityService
      .getList({ page: 1, perPage: 10 })
      .subscribe(result => console.log(result.items));
  }
}
```

## Token factories

Use the factory helpers when multiple services share the same capability or when you need feature-scoped tokens. They accept a custom description to improve debugging.

| Factory                                                                                                  | Returns                                        |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `createDataGetListServiceToken<TList, P>(description?)`                                                  | `InjectionToken<DataGetListService<TList, P>>` |
| `createDataReadServiceToken<TEntity, TList, P, ID, ReadOptions>(description?)`                           | `InjectionToken<DataReadService<...>>`         |
| `createDataWriteServiceToken<TEntity, ID, WriteOptions, Create, Update>(description?)`                   | `InjectionToken<DataWriteService<...>>`        |
| `createDataServiceToken<TEntity, TList, P, ID, ReadOptions, WriteOptions, Create, Update>(description?)` | `InjectionToken<DataCrudService<...>>`         |

These factories are defined in `data-crud.tokens.ts`.@libs/core/util/api/src/lib/data-crud.tokens.ts#10-62

## Providing a REST implementation

1. **Extend `ApiService`.** Override `resourceUrlSegment`, optionally `mapListResponse`, `mapItemResponse`, or `cacheTime`.
2. **Expose the CRUD contract:**

   ```ts
   import { Injectable } from '@angular/core';
   import { ApiService } from '@plastik/core/util/api';

   interface FeatureDto {
     /* ... */
   }
   interface FeatureParams {
     page?: number;
   }

   @Injectable()
   export class FeatureApiService extends ApiService<FeatureDto[], FeatureParams, FeatureDto> {
     protected resourceUrlSegment(): string {
       return 'feature';
     }
   }
   ```

3. **Provide the service:** either rely on the default tokens or create feature tokens for explicit wiring.

   ```ts
   import { provideEffects } from '@ngrx/effects';
   import { DATA_CRUD_SERVICE } from '@plastik/core/util/api';

   export const provideFeatureData = () => [
     { provide: DATA_CRUD_SERVICE, useExisting: FeatureApiService },
   ];
   ```

## Providing a PocketBase implementation

1. **Extend `PocketBaseService`** and declare the PocketBase collection.

   ```ts
   @Injectable()
   export class FeaturePocketBaseService extends PocketBaseService<FeatureRecord> {
     protected collectionName(): string {
       return 'feature';
     }
   }
   ```

2. **Override mapping or caching** if needed (`mapResponse`, `mapListResponse`, `cacheTime`).
3. **Provide the CRUD contract** using the same tokens as with REST services.

## Consuming CRUD services

Inject the desired token in feature code (components, effects, signal stores, etc.).

```ts
import { inject, Injectable, signal } from '@angular/core';
import { DataCrudService, DATA_CRUD_SERVICE } from '@plastik/core/util/api';

@Injectable()
export class FeatureFacade {
  #crud = inject<DataCrudService<FeatureDto, FeatureDto[]>>(DATA_CRUD_SERVICE);
  readonly items = signal<FeatureDto[]>([]);

  load(params?: FeatureParams) {
    this.#crud.getList(params).subscribe(({ items }) => this.items.set(items));
  }
}
```

When multiple implementations are present (e.g. REST vs PocketBase), create named tokens via the factories to keep the dependency graph explicit.

## Testing

Use the token factories to provide test doubles.

```ts
const DATA_CRUD_TEST_TOKEN = createDataServiceToken<FeatureDto, FeatureDto[]>('FEATURE_CRUD_TEST');

TestBed.configureTestingModule({
  providers: [{ provide: DATA_CRUD_TEST_TOKEN, useValue: mockCrudService }],
});
```

Run `nx test core-util-api` to execute the library unit tests.
