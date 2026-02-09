# @plastik/eco-store/core/tenant

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/core/tenant](#plastikeco-storecoretenant)
  - [Description](#description)
  - [Architecture](#architecture)
    - [Services](#services)
    - [Factory](#factory)

## Description

This library handles **multi-tenancy resolution** for the Eco-Store application. It is responsible for identifying the current tenant (client) based on the
execution context (e.g., subdomain, environment) and providing the tenant configuration to the rest of the application.

## Architecture

It uses a strategy pattern to resolve the tenant ID, which is then used to filter data (like products) for the specific storefront.

### Services

- **`ecoStoreTenantStore`**: A signal store that manages the tenant state and provides derived configuration.
  - It handles **fetching the tenant** from the `EcoStoreTenantBaseService`.
  - It manages **tenant-specific addresses** via `getTenantAddresses()`, which loads addresses from `EcoStoreTenantAddressService`.
  - It provides **computed selectors**:
    - `storeStatus`: Calculates the current window status (`OPEN`, `CLOSED`, `OPENING_SOON`, `CLOSING_SOON`, etc) using a minute-by-minute reactive timer.
    - `nextOpenDate`: Returns the next opening date or the next closing date (when `CLOSING_SOON` is active) to support urgency countdowns.
    - `isStoreOpen`: Returns `true` if the status is either `OPEN` or `CLOSING_SOON`.
    - `tenantLegalAddress`: Returns the tenant's legal/registered address.
    - `tenantAddressesContacts`: Returns tenant addresses formatted as `UserContact[]`, sorted with default address first.
  - It provides **helper methods** for logistics configuration:
    - `getTenantDeliveryOptionSlotsDays()` and `getTenantDeliveryOptionSlotsTimes()`: Support both delivery and pickup slots (pickup requires `addressId`).
    - `getTenantDeliveryOptionCost()`: Calculates shipping cost based on tiered pricing.
    - `getTenantDeliveryPriceTiers()`: Returns delivery price tiers for progress indicators.
    - `getTenantDeliveryPriceForFreeShipping()`: Calculates remaining amount for free shipping.
- **`EcoStoreTenantBaseService`**: Abstract base class defining the contract for tenant resolution.
  - It provides the core logic for **resolving the tenant slug** and loading it from the backend.
- **`EcoStoreTenantService`**: Standard implementation that resolves the tenant slug from the **URL subdomain**
  (e.g., `tenant-name.eco-store.com` -> `tenant-name`).
- **`EcoStoreTenantStagingService`**: Implementation for **staging environments**
  (e.g., `staging.eco-store.com?tenant=tenant-name` or specific testing rules).

### Factory

- **`provideEcoStoreTenant`**: A provider configuration that dynamically injects the correct `EcoStoreTenantBaseService`
  implementation based on the current `ENVIRONMENT` configuration (production vs staging). The service is then typically used within an `APP_INITIALIZER` to load the tenant before app startup.
