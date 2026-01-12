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

- **`EcoStoreTenantBaseService`**: Abstract base class defining the contract for tenant resolution.
- **`EcoStoreTenantService`**: Standard implementation that resolves the tenant slug from the **URL subdomain**
  (e.g., `tenant-name.eco-store.com` -> `tenant-name`).
- **`EcoStoreTenantStagingService`**: Implementation for **staging environments**
  (e.g., `staging.eco-store.com?tenant=tenant-name` or specific testing rules).

### Factory

- **`provideEcoStoreTenant`**: An `APP_INITIALIZER` provider factory that dynamically injects the correct `EcoStoreTenantBaseService`
  implementation based on the current `ENVIRONMENT` configuration (production vs staging).
