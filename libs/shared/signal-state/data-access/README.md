# Signal State - Data Access Library

## Table of Contents

- [Signal State - Data Access Library](#signal-state---data-access-library)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
    - [Main Components](#main-components)
      - [EntityFireService](#entityfireservice)
      - [StoreFirebaseCrudFeature](#storefirebasecrudfeature)
      - [StoreNotificationService](#storenotificationservice)
  - [Usage Example](#usage-example)
    - [1. Define your entity model](#1-define-your-entity-model)
    - [2. Add custom feature types and initial store values type if needed](#2-add-custom-feature-types-and-initial-store-values-type-if-needed)
    - [3. Create your Firebase service](#3-create-your-firebase-service)
    - [4. Implement your Store](#4-implement-your-store)
    - [5. Use in Component](#5-use-in-component)
  - [Available Store Methods](#available-store-methods)
    - [State Management](#state-management)
    - [CRUD Operations](#crud-operations)
    - [Filtering \& Pagination](#filtering--pagination)
    - [Other Methods](#other-methods)
  - [Advanced Usage](#advanced-usage)
    - [Error Handling and Redirections](#error-handling-and-redirections)
    - [Performance Considerations](#performance-considerations)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides a set of tools to implement state management patterns with NGRX Signals, optimized for Angular applications using Firebase/Firestore as a backend.
It facilitates the creation of reactive stores with CRUD operations, pagination management, filtering, and sorting.

The Signal State Data Access library provides:

- Simplified implementation of stores with NGRX Signals
- Automatic integration with Firebase/Firestore
- Predefined and customizable CRUD functionalities
- Integrated notification system
- Pagination, filtering, and sorting management
- Automatic error handling and redirections

### Main Components

#### EntityFireService

Abstract base service that provides CRUD functionalities for entities in Firestore. It is designed to work with entities that extend from `BaseEntity` and provides complete integration with Firebase/Firestore.

**Main Features:**

- **Connection Management**: Maintains an active connection state with Firestore using signals. The `activeConnection` signal controls all Firestore operations:

  - When `true`: Enables all Firestore operations and maintains the collection reference.
  - When `false`: Disables all Firestore operations, returns empty results, and clears the collection reference.
  - Each CRUD operation checks this signal before executing to ensure proper connection state.

- **CRUD Operations**:
  - `getAll()`: Retrieves entities with pagination, filtering, and sorting.
  - `getItem()`: Retrieves a specific entity by ID.
  - `create()`: Creates a new entity.
  - `update()`: Updates an existing entity.
  - `delete()`: Removes an entity.
  - `getCount()`: Gets the total number of entities based on the applied filter.

**Customization:**

- Allows defining custom filtering conditions through `getFilterConditions()`.
- Supports pagination with `getPaginationConditions()`.
- Manages sorting through `getSortingConditions()`.
- Includes integrated error handling.

**Usage:**

To implement a specific service:

1. Extend `EntityFireService<T>`.
2. Define the `path` property with the Firestore route.
3. Implement `getFilterConditions()` according to needs.
4. Optionally override other methods to customize behavior.

#### StoreFirebaseCrudFeature

Feature to implement stores with CRUD and Firebase functionalities. It provides a comprehensive set of methods for managing state and data operations.

#### StoreNotificationService

Service to display notifications related to store operations. It handles success and error messages for all CRUD operations.

## Usage Example

### 1. Define your entity model

```typescript
interface Product extends BaseEntity {
  name: string;
  price: number;
  description: string;
  category: string;
}
```

### 2. Add custom feature types and initial store values type if needed

```typescript
export type StoreProductFilter = StoreFirebaseCrudFilter & {
  text: string;
  category: 'all' | string;
  inStock?: boolean;
};

export const initState: StoreFirebaseCrudState<Product, StoreProductFilter> = {
  ...initStoreFirebaseCrudState(),
  filter: {
    text: '',
  },
  pagination: {
    pageSize: 5,
    pageIndex: 0,
    pageLastElements: new Map<number, Product>(),
  },
  sorting: ['updatedAt', 'desc'] as TableSortingConfig,
  baseRoute: 'product/list',
};
```

### 3. Create your Firebase service

```typescript
@Injectable({ providedIn: 'root' })
export class ProductFirebaseService extends EntityFireService<Product> {
  protected readonly path = 'products';

  // Override methods if needed to customize behavior
  protected override getFilterConditions(filter: StoreProductFilter): QueryConstraint[] {
    const conditions: QueryConstraint[] = [];

    if (Object.entries(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        if (key === 'text' && value) {
          const normalizedText = latinize(value as string).toLowerCase();
          conditions.push(
            where('normalizedName', '>=', normalizedText),
            where('normalizedName', '<=', normalizedText + '\uf8ff')
          );
        } else if (key === 'category' && value !== 'all') {
          conditions.push(where('categoryRef', '==', value));
        } else if (key === 'inStock' && value !== undefined) {
          conditions.push(where('isAvailable', '==', value));
        }
      });
    }

    return conditions;
  }
}
```

### 4. Implement your Store

```typescript
export const productStore = signalStore(
  { providedIn: 'root' },
  withFirebaseCrud<
    Product,
    ProductFirebaseService,
    StoreProductFilter,
    StoreFirebaseCrudState<Product, StoreProductFilter>
  >({
    featureName: 'product',
    dataServiceType: ProductFirebaseService,
    initState,
    baseRoute: { onCreate: 'product/list', onUpdate: 'product/list', onError: '' },
  })
  // add here specific state or methods for product store
);
```

### 5. Use in Component

```typescript
@Component({
  selector: 'app-product-list',
  template: ` <div *ngIf="store.loading()">Loading...</div>

    <div *ngIf="!store.loading()">
      <app-search-bar [searchTerm]="store.filter().text" (search)="updateSearch($event)">
      </app-search-bar>

      <app-product-table
        [products]="store.entities()"
        [totalCount]="store.count()"
        (pageChange)="onPageChange($event)">
      </app-product-table>
    </div>`,
})
export class ProductListComponent {
  readonly store = inject(productStore);

  updateSearch(searchTerm: string) {
    this.store.setFilter({
      ...this.store.filter(),
      text: searchTerm,
    });
  }

  onPageChange(event: PageEvent) {
    this.store.setPagination({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
```

## Available Store Methods

### State Management

- `_activeConnection()`: Get active connection state. If the value is `true`, the store is connected to Firestore. If it is `false`, the store is disconnected from Firestore and the store is reset to initial state.
- `initiallyLoaded()`: Get initially loaded state. When we get a list of entities for the first time, this state is set to `true`.
- `_lastUpdated()`: Sets last change state time.
- `selectedItemId()`: Get selected item ID.
- `showNotification()`: Get show notification state.
- `count()`: Get count of entities.
- `baseRoute()`: Get base route used by default to navigate after creating or updating an entity.
- `filter()`: Get filter state.
- `pagination()`: Get pagination state.
- `sorting()`: Get sorting state.

### CRUD Operations

- `getAll()`: Get all entities paginated and filtered.
- `getItem(id: string)`: Get single entity (redirects to baseRoute if item not found).
- `create({ item: Partial<T>, redirectUrl?: string })`: Create new entity.
- `update({ item: Partial<T>, redirectUrl?: string })`: Update entity.
- `delete(item: T)`: Delete entity.

> RedirectUrl is optional and is used to navigate after creating or updating an entity. If not provided, the store will navigate to the baseRoute defined in the store configuration.

### Filtering & Pagination

- `setFilter(filter: F)`: Update filter.
- `setPagination(pagination: Pick<StoreFirebaseCrudPagination<T>, 'pageIndex' | 'pageSize'>)`: Update pagination.
- `setSorting(sorting: TableSortingConfig)`: Update sorting.
- `resetTableConfig(pagination: Pick<StoreFirebaseCrudPagination<T>, 'pageSize' | 'pageIndex'>, filter: F, sorting: TableSortingConfig)`: Reset pagination, filter and sorting, normally when changing a route.

### Other Methods

- `setShowNotification(show: boolean)`: Update show notification state.
- `setSelectedItemId(id: EntityId | null)`: Update selected item ID.
- `setCount()`: Update entities count.
- `setActive(active: boolean)`: Set active connection to Firestore.
- `destroy()`: Kill connection to Firestore and resets the store.

## Advanced Usage

### Error Handling and Redirections

The library automatically handles not-found items by redirecting to the specified `baseRoute` in the store configuration.
This is useful for cases where a user tries to access a non-existent item through a direct URL.

```typescript
// Example of redirection happening when item not found
if (!item) {
  // Redirect to baseRoute
  router.navigate([store.baseRoute()]);
  throw new Error();
}
```

### Performance Considerations

- Consider using pagination when dealing with large collections
- Optimize your filter conditions to minimize Firestore reads
- Use compound queries when possible to improve query performance

## Running unit tests

Run `nx test signal-state-data-access` to execute the unit tests.
