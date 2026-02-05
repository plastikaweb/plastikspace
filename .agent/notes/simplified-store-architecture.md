# Simplified Signal Store Architecture

## Overview

We've refactored the HTTP and PocketBase stores from a complex modular approach to **3 simple, pragmatic stores** that cover real-world use cases.

## The 3 Store Pattern

### 1. **GetList** - Read-Only Lists

**Use case**: Display a list of items (products, articles, users, etc.)

**Operations**: `getList()`

**State**:

- `entities` - Array of items
- `entityMap` - Dictionary by ID
- `ids` - Array of IDs
- `count` - Total count
- `loading` - Loading state
- `error` - Error message
- `initiallyLoaded` - Has loaded at least once

**Example**:

```typescript
export const ProductListStore = signalStore(
  { providedIn: 'root' },
  withHttpGetList<Product, ProductHttpService>({
    featureName: 'productList',
    dataServiceType: ProductHttpService,
  })
);
```

### 2. **Get** - List + Detail

**Use case**: List view + detail page (e.g., product list + product detail)

**Operations**: `getList()`, `getOne()`

**State**: All from GetList +

- `selectedItem` - Currently selected item
- `loadingItem` - Loading state for detail
- `errorItem` - Error for detail

**Example**:

```typescript
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withHttpGet<Product, ProductHttpService>({
    featureName: 'product',
    dataServiceType: ProductHttpService,
  })
);
```

### 3. **CRUD** - Full CRUD Operations

**Use case**: Admin panels, backoffice, management interfaces

**Operations**: `getList()`, `getOne()`, `create()`, `update()`, `delete()`

**State**: All from Get +

- `creating` / `errorCreate`
- `updating` / `errorUpdate`
- `deleting` / `errorDelete`

**Features**:

- ✨ **Optimistic updates**: Automatically updates entities using `addEntity()`, `updateEntity()`, `removeEntity()`
- 🔔 **Notifications**: Shows success/error notifications
- 📊 **Count management**: Automatically updates count after create/delete

**Example**:

```typescript
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withHttpCrud<Product, ProductHttpService>({
    featureName: 'product',
    dataServiceType: ProductHttpService,
  })
);

// Usage
store.create(newProduct); // Automatically adds to entities
store.update({ id, data }); // Automatically updates in entities
store.delete(id); // Automatically removes from entities
```

## Implementation

### HTTP Stores

- `withHttpGetList` - `/libs/shared/signal-state/data-access-http/src/lib/with-http-get-list.store.ts`
- `withHttpGet` - `/libs/shared/signal-state/data-access-http/src/lib/with-http-get.store.ts`
- `withHttpCrud` - `/libs/shared/signal-state/data-access-http/src/lib/with-http-crud.store.ts`

### PocketBase Stores

- `withPocketBaseGetList` - `/libs/shared/signal-state/data-access-pocketbase/src/lib/with-pocketbase-get-list.store.ts`
- `withPocketBaseGet` - `/libs/shared/signal-state/data-access-pocketbase/src/lib/with-pocketbase-get.store.ts`
- `withPocketBaseCrud` - `/libs/shared/signal-state/data-access-pocketbase/src/lib/with-pocketbase-crud.store.ts`

## Benefits

### Before (Modular Approach)

❌ 6+ individual stores to compose
❌ Complex composition logic
❌ No automatic entity updates
❌ Manual refresh after mutations
❌ Unclear which stores to use when

### After (3-Store Pattern)

✅ 3 clear stores for 3 use cases
✅ Simple, direct usage
✅ Automatic optimistic updates (CRUD)
✅ No manual refresh needed
✅ Clear decision: read-only → GetList, read + detail → Get, mutations → CRUD

## Migration Guide

### Old (Modular)

```typescript
// Had to compose multiple stores
withHttpGetListCRUD(...),
withHttpGetOneCRUD(...),
withHttpCreateCRUD(...),
withHttpUpdateCRUD(...),
withHttpDeleteCRUD(...)
```

### New (Simplified)

```typescript
// Just use the appropriate store
withHttpCrud(...)  // If you need CRUD
withHttpGet(...)   // If you only need read
withHttpGetList(...) // If you only need list
```

## Entity Management

All stores use `withEntities` from `@ngrx/signals/entities`:

- **Normalized storage**: Entities stored in a dictionary by ID
- **Efficient updates**: Only changed entities re-render
- **Rich selectors**: `entities()`, `entityMap()`, `ids()`
- **Optimistic updates**: CRUD operations update entities immediately

## Decision Tree

```mermaid
Do you need to CREATE, UPDATE, or DELETE items?
├─ YES → Use withHttpCrud / withPocketBaseCrud
└─ NO
   └─ Do you need to view DETAIL pages?
      ├─ YES → Use withHttpGet / withPocketBaseGet
      └─ NO → Use withHttpGetList / withPocketBaseGetList
```

## Examples

### Read-Only Product List

```typescript
export const ProductListStore = signalStore(
  { providedIn: 'root' },
  withHttpGetList<Product, ProductHttpService>({
    featureName: 'productList',
    dataServiceType: ProductHttpService,
  })
);

// Component
products = this.store.entities;
loading = this.store.loading;
```

### Product List + Detail

```typescript
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withHttpGet<Product, ProductHttpService>({
    featureName: 'product',
    dataServiceType: ProductHttpService,
  })
);

// List component
products = this.store.entities;

// Detail component
product = this.store.selectedItem;
this.store.getOne(id);
```

### Product Management (Admin)

```typescript
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withHttpCrud<Product, ProductHttpService>({
    featureName: 'product',
    dataServiceType: ProductHttpService,
  })
);

// Component
createProduct(data: Partial<Product>) {
  this.store.create(data);
  // Entity automatically added to list!
}

updateProduct(id: string, data: Partial<Product>) {
  this.store.update({ id, data });
  // Entity automatically updated!
}

deleteProduct(id: string) {
  this.store.delete(id);
  // Entity automatically removed!
}
```

## Legacy Stores

The old modular stores are still in the codebase but commented out in exports:

- `http-get-list-crud.store.ts`
- `http-get-one-crud.store.ts`
- `http-create-crud.store.ts`
- `http-update-crud.store.ts`
- `http-delete-crud.store.ts`
- `http-full-crud.store.ts`

These can be deleted once we confirm all usages have been migrated.

## Summary

The new 3-store pattern is:

- **Simpler**: 3 stores instead of 6+
- **Clearer**: Each store has a specific use case
- **Smarter**: Automatic optimistic updates
- **Faster**: Less boilerplate, less code
- **Better**: Follows real-world usage patterns

Choose the store based on what you need to DO, not what operations exist.
