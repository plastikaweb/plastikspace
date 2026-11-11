# @plastik/eco/entities

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

- [@plastik/eco/entities](#plastikecoentities)
  - [Description](#description)
  - [Who can import it](#who-can-import-it)
  - [Exports](#exports)
  - [Dependencies](#dependencies)
  - [Running unit tests](#running-unit-tests)

## Description

Domain entities of the eco platform, shared by `eco-store` and `eco-admin`: tenant, product, product category, cart and order.
Most of the library is types; it also holds the constants and the two pure helpers that go with those types.

The files were promoted unchanged from `@plastik/eco-store/entities` (AREF-01).
That alias still exists as a compatibility re-export of this library, so existing eco-store imports keep working.
New code imports from `@plastik/eco/entities`.

## Who can import it

The library is tagged `scope:eco`, `type:entity`. Only `scope:eco-store`, `scope:eco-admin` and other `scope:eco` libraries may depend on it; `@nx/enforce-module-boundaries` rejects any other importer.

## Exports

### `tenant.ts`

- `EcoStoreTenant`, `EcoStoreTenantAddress`, `EcoStoreTenantWindowStatus`
- Logistics: `EcoStoreTenantLogistics`, `EcoStoreTenantLogisticsDeliveryOption`, `EcoStoreTenantLogisticsDeliveryTier`, `EcoStoreTenantLogisticsDeliveryType`
- Slots: `SlotDays`, `TimePoint`, `TimeRange`, `DAYS_MAP`

### `product.ts`

- `EcoStoreProduct`, `CreateEcoStoreProduct`, `UpdateEcoStoreProduct`
- `EcoStoreProductFilter`, `EcoStoreProductWithCategoryName`, `ProductUnitType`, `ProductRating`

### `productCategory.ts`

- `ProductCategory`, `CreateProductCategory`, `UpdateProductCategory`
- `ProductCategoryFilters`, `ProductCategoryStats`, `ProductCategoryGroup`

### `cart.ts`

- `EcoStoreCart`, `EcoStoreCartItem`, `EcoStoreCartStatus`

### `order.ts`

- `EcoStoreOrder`, `NewEcoStoreOrder`, `EcoStoreOrderItemSnapshot`, `EcoStoreOrderStatus`, `EcoStorePaymentStatus`, `ORDER_STATUSES`
- Status maps: `ORDER_STATUS_ICON_MAP`, `ORDER_STATUS_LABEL_MAP`, `ORDER_STATUS_TYPE_MAP`, `ORDER_STATUS_OPTIONS`
- Delivery maps: `ORDER_DELIVERY_ICON_MAP`, `ORDER_DELIVERY_LABEL_MAP`
- Helpers: `generateOrderNumber`, `toOrderItemSnapshot`

There is no order-cycle type yet. The `order_cycles` PocketBase collection has no TypeScript counterpart; it is added with the first feature that reads it.

## Dependencies

- [`@plastik/core/entities`](../../core/entities/README.md): the PocketBase base entities (`BasePocketBaseEntityWithTenantRef`, `UserContact`, …).
- `@plastik/shared/entities`: `SharedChipType`, used by the order status maps.
- `@plastik/shared/latinize`: `latinize`, used by `generateOrderNumber`.

## Running unit tests

Run `nx test eco-entities` to execute the unit tests.
