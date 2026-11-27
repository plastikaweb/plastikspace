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

Domain entities of the eco platform, shared by `eco-store` and `eco-admin`: tenant, product, product category, cart, order, order cycle and the status chips of each state machine.
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
- Status maps: `ORDER_STATUS_ICON_MAP`, `ORDER_STATUS_LABEL_MAP`, `ORDER_STATUS_TYPE_MAP`, `ORDER_STATUS_OPTIONS`.
  Seven states, `EXPIRED` included and the legacy `PAID` left out, drawn as the frozen `Eco Admin DS` §06 draws them in both apps.
- Delivery maps: `ORDER_DELIVERY_ICON_MAP`, `ORDER_DELIVERY_LABEL_MAP`
- Helpers: `generateOrderNumber`, `toOrderItemSnapshot`

### `order-cycle.ts`

- `ORDER_CYCLE_STATUSES` and `EcoStoreOrderCycleStatus`, the values of `order_cycles.status` (AREF-10). The collection itself has no TypeScript counterpart yet; it is added with the first feature that reads it.

### `status-chip.ts` and `status-families.ts`

The status chips of the platform's state machines, one name per state in both apps (AREF-10).
Each family gives its states and one `*_STATUS_CHIPS` object with four maps derived from one config: `labels`, `icons`, `types` and `options`.
A label is the translation key `<family>.status.<state>`. Icons and colours follow the frozen `Eco Admin DS` §06; the order family stays in `order.ts`.

- `ecoStatusChipMaps`, `EcoStatusChipConfig`, `EcoStatusChipMaps`, `EcoStatusChipOption`
- Cycle: `ORDER_CYCLE_STATUS_CHIPS` (`cycles.status.*`)
- Payment: `PAYMENT_STATUSES`, `PAYMENT_STATUS_CHIPS` (`payments.status.*`), every state with the `euro` icon
- Membership: `MEMBERSHIP_STATUSES`, `MEMBERSHIP_STATUS_CHIPS` (`members.status.*`)
- Request: `TENANT_REQUEST_STATUSES`, `EcoTenantRequestStatus`, `TENANT_REQUEST_STATUS_CHIPS` (`requests.status.*`)
- Allowlist: `MEMBER_ALLOWLIST_STATUSES`, `EcoMemberAllowlistStatus`, `MEMBER_ALLOWLIST_STATUS_CHIPS` (`allowlist.status.*`); the three states are derived from `usedAt` and `revoked`, never stored

eco-admin translates every key, in `ca` and `es`. The spec checks the cycle, payment and membership states against the select values of `apps/eco-store/pocketbase/pb_schema.json`.

## Dependencies

- [`@plastik/core/entities`](../../core/entities/README.md): the PocketBase base entities (`BasePocketBaseEntityWithTenantRef`, `UserContact`, …).
- `@plastik/shared/entities`: `SharedChipType`, used by the order status maps.
- `@plastik/shared/latinize`: `latinize`, used by `generateOrderNumber`.

## Running unit tests

Run `nx test eco-entities` to execute the unit tests.
