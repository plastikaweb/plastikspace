# @plastik/core/api-firebase

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)

- [Description](#description)
- [Architecture](#architecture)
- [Usage](#usage)
- [Advanced Usage](#advanced-usage)
- [Exports](#exports)

## Description

**api-firebase** provides **Firebase Firestore CRUD utilities** for the application. It contains base classes and types that implement common Firebase operations with pagination, sorting, and filtering.

**Key Benefits:**

- Centralized Firebase/Firestore logic.
- Complete abstract base class (`EntityFireService`) with CRUD.
- Standardized type definitions.

> **Note**: This library contains only Firebase/Firestore-specific types. State management types belong to `libs/shared/signal-state/data-access-firebase`.

## Architecture

### Core Components

1. **`EntityFireService<T>`**: Abstract base class implementing `getList`, `getOne`, `create`, `update`, `delete`, `getCount`.
2. **`FirebaseServiceType<T>`**: Interface defining the contract.
3. **Type Definitions**: `FirebaseCrudPagination<T>`, `FirebaseCrudFilter`.

## Usage

### 1. Create Your Entity Service

```typescript
// product-fire.service.ts
import { Injectable } from '@angular/core';
import { where, QueryConstraint } from '@angular/fire/firestore';
import { EntityFireService, FirebaseCrudFilter } from '@plastik/core/api-firebase';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductFireService extends EntityFireService<Product> {
  protected override path = 'products';

  protected override getFilterConditions(filter: FirebaseCrudFilter): QueryConstraint[] {
    const conditions: QueryConstraint[] = [];

    if (filter['category']) {
      conditions.push(where('category', '==', filter['category']));
    }

    if (filter['active'] !== null) {
      conditions.push(where('active', '==', filter['active']));
    }

    return conditions;
  }
}
```

### 2. Implement Filter Conditions

The only method you **must** implement is `getFilterConditions()`. This converts your filter object into Firestore query constraints.

### 3. Use in Your Application

```typescript
// product.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ProductFireService } from './product-fire.service';

@Component({ ... })
export class ProductComponent implements OnInit {
  private productService = inject(ProductFireService);

  ngOnInit() {
    // Get paginated list
    this.productService.getList({
      pagination: { pageIndex: 0, pageSize: 10, pageLastElements: new Map() },
      sorting: ['updatedAt', 'desc'],
      filter: { category: 'electronics', active: true }
    }).subscribe(products => {
      console.log('Products:', products);
    });
  }

  createProduct() {
    // Create returns the complete entity with Firebase-assigned ID
    this.productService.create({
      name: 'New Product',
      category: 'electronics',
      price: 99.99
    }).subscribe(createdProduct => {
      console.log('Created product with ID:', createdProduct.id);
      // createdProduct is type Product with all fields including the ID
    });
  }
}
```

## Advanced Usage

### Custom Type Conversion

Override `firebaseAssignTypes()` to customize how your entity is converted to/from Firestore.

### Error Handling

`EntityFireService` automatically handles Firebase permission errors. Override `handlePermissionError()` to customize.

## Exports

```typescript
// Main exports
export { EntityFireService } from '@plastik/core/api-firebase';
export { FirebaseServiceType } from '@plastik/core/api-firebase';

// Type exports
export type { FirebaseCrudPagination, FirebaseCrudFilter } from '@plastik/core/api-firebase';
```
