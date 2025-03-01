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
    - [2. Add custom filter type if needed](#2-add-custom-filter-type-if-needed)
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

Base service that provides CRUD functionalities for entities in Firestore.

#### StoreFirebaseCrudFeature

Feature to implement stores with CRUD and Firebase functionalities.

#### StoreNotificationService

Service to display notifications related to store operations.

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

### 2. Add custom filter type if needed

```typescript
export type StoreProductFilter = StoreFirebaseCrudFilter & {
  text: string;
  category: 'all' | string;
  inStock?: boolean;
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
  withFirebaseCrud<Product, ProductFirebaseService, StoreProductFilter>({
    featureName: 'product',
    dataServiceType: ProductFirebaseService,
    initFilter: {
      text: '',
      category: 'all',
    },
    initPagination: {
      pageIndex: 0,
      pageSize: 25,
      pageLastElements: new Map<number, Product>(),
    },
    initSorting: ['updatedAt', 'desc'],
    baseRoute: '/products', // Used for redirections when item not found
  })
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

- `loading()`: Get loading state
- `initiallyLoaded()`: Get initially loaded state
- `error()`: Get error state

### CRUD Operations

- `getAll()`: Get all entities
- `getItem(id: string)`: Get single entity (redirects to baseRoute if item not found)
- `create(entity: Partial<T>)`: Create new entity
- `update(entity: Partial<T>)`: Update entity
- `delete(entity: T)`: Delete entity

### Filtering & Pagination

- `setFilter(filter: F)`: Update filter
- `setPagination(pagination: Pick<StoreFirebaseCrudPagination<T>, 'pageIndex' | 'pageSize'>)`: Update pagination
- `setSorting(sorting: TableSortingConfig)`: Update sorting

### Other Methods

- `setShowNotification(show: boolean)`: Update show notification state
- `setSelectedItemId(id: EntityId | null)`: Update selected item ID
- `setCount()`: Update count

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
