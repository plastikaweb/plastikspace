# @plastik/eco-store/products/data-access

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx Signals](https://img.shields.io/badge/ngrx%20signals-%23270341.svg?style=for-the-badge&logo=ngrx&logoColor=white)

- [@plastik/eco-store/products/data-access](#plastikeco-storeproductsdata-access)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Store Usage](#store-usage)
    - [SignalStore Features](#signalstore-features)
  - [Integration](#integration)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides the state management and API integration for products in the Eco Store application. It leverages NgRx Signals for a reactive and performant data layer.

## Features

- **Store-based State Management**: Uses `ecoStoreProductsStore` (NgRx SignalStore) for managing product lists, pagination, filtering, and selection.
- **PocketBase Integration**: Built-in support for PocketBase CRUD operations via [`EcoStoreGetService`](../../core/api/data-access/README.md), ensuring all requests are scoped to the current tenant.
- **Enhanced Data Transformation**:
  - **Localization**: Automatically translates `name`, `description`, and `features` based on the current application language.
  - **Category Mapping**: Enriches products with localized category names, slugs, and colors by integrating with `ecoStoreProductCategoriesStore`.
- **Slug-based Operations**: Supports selecting and loading products directly by their URL slugs.
- **Smart Data Access**: Provides computed signals for transformed data, ensuring UI components receive ready-to-display objects.

## Installation

```ts
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
```

## Usage

### Store Usage

```typescript
const store = inject(ecoStoreProductsStore);

// Access reactive signals with translated text and category info
const products = store.productsWithTranslatedText();
```

### SignalStore Features

The store includes several custom features and computed signals:

- **`productsWithTranslatedText`**: (Computed) Returns a list of products where all localized fields are resolved for the current language, and category information is attached.
- **`setSelectedFromSlug(slug)`**: (Method) Selects a product from the current list based on its slug.
- **`loadProductBySlug(slug)`**: (Method) Fetches a product from the API by its slug and sets it as the selected item.

## Integration

The store relies on the following environments and services:

- `POCKETBASE_WITH_TRANSLATION_ENVIRONMENT`: For default language and API configuration.
- `TranslateService`: For reactive language switching.
- `ecoStoreProductCategoriesStore`: For category data lookup.

## Running unit tests

Run `nx test eco-store-products-data-access` to execute the unit tests via Jest.
