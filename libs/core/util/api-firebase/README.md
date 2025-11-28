# api-firebase

- [api-firebase](#api-firebase)
  - [📚 Overview](#-overview)
  - [🏗️ Architecture](#️-architecture)
    - [Core Components](#core-components)
  - [🚀 Usage](#-usage)
    - [1. Create Your Entity Service](#1-create-your-entity-service)
    - [2. Implement Filter Conditions](#2-implement-filter-conditions)
    - [3. Use in Your Application](#3-use-in-your-application)
  - [🔧 Advanced Usage](#-advanced-usage)
    - [Custom Type Conversion](#custom-type-conversion)
    - [Error Handling](#error-handling)
  - [📦 Exports](#-exports)

This library provides **Firebase Firestore CRUD utilities** for the application.
It contains base classes and types that implement common Firebase operations with pagination, sorting, and filtering.

## 📚 Overview

`api-firebase` centralizes all Firebase/Firestore-related logic, providing:

- **`EntityFireService`**: A complete abstract base class with CRUD operations
- **`FirebaseServiceType`**: The interface/contract for Firebase services
- **Type definitions**: `FirebaseCrudPagination`, `FirebaseCrudFilter`

**Note**: This library contains only Firebase/Firestore-specific types. State management types (like `FirebaseCrudState`) belong to `libs/shared/signal-state/data-access-firebase`.

This library follows the same philosophy as `api-base`: it defines _what_ and _how_ Firebase services work, allowing you to extend and customize for specific entities.

## 🏗️ Architecture

### Core Components

1. **`EntityFireService<T>`** - Abstract base class that implements:
   - `getList()` - Paginated, sorted, and filtered list retrieval
   - `getOne()` - Single item retrieval by ID
   - `create()` - Create new documents and return the complete entity with ID
   - `update()` - Update existing documents
   - `delete()` - Delete documents
   - `getCount()` - Count documents matching a filter
   - Connection management with `activeConnection` signal
   - Automatic error handling for permission errors

2. **`FirebaseServiceType<T>`** - Abstract interface defining the contract

3. **Type Definitions**:
   - `FirebaseCrudPagination<T>` - Pagination configuration with cursor tracking
   - `FirebaseCrudFilter` - Filter criteria type

## 🚀 Usage

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

## 🔧 Advanced Usage

### Custom Type Conversion

Override `firebaseAssignTypes()` to customize how your entity is converted to/from Firestore:

```typescript
protected override firebaseAssignTypes() {
  return {
    toFirestore(doc: Product): DocumentData {
      return {
        ...doc,
        normalizedName: latinize(doc.name).toLowerCase(),
        price: Number(doc.price), // Ensure number type
        createdAt: doc.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): Product {
      const data = snapshot.data() as Product;
      return {
        ...data,
        price: Number(data.price), // Ensure number type
      };
    },
  };
}
```

### Error Handling

`EntityFireService` automatically handles Firebase permission errors by returning default values instead of throwing. You can customize this behavior by overriding `handlePermissionError()`.

## 📦 Exports

```typescript
// Main exports
export { EntityFireService } from '@plastik/core/api-firebase';
export { FirebaseServiceType } from '@plastik/core/api-firebase';

// Type exports
export type { FirebaseCrudPagination, FirebaseCrudFilter } from '@plastik/core/api-firebase';
```
