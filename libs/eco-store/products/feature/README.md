# @plastik/eco-store/products/feature

- [@plastik/eco-store/products/feature](#plastikeco-storeproductsfeature)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Components](#components)
    - [EcoStoreProductsFeature](#ecostoreproductsfeature)
      - [Selector](#selector)
      - [Inputs](#inputs)
      - [Outputs](#outputs)
      - [Example](#example)
  - [Running unit tests](#running-unit-tests)

## Description

This library provides the products feature module for the Eco Store application.
It includes the main products list view and related components that use the product card component from the shared library.

## Features

- Displays a responsive grid of product cards
- Integrates with the products data access layer for state management
- Supports filtering and pagination
- Uses Angular Signals for efficient change detection
- Implements OnPush change detection for optimal performance
- Responsive design that works on different screen sizes

## Installation

This library is part of the `@plastik/eco-store` scope. To use it in your application:

1. Ensure the library and its dependencies are built in your Nx workspace
2. Import the `EcoStoreProductsFeature` component in your module or standalone component

## Usage

Import the `EcoStoreProductsFeature` component and use it in your application:

```typescript
import { Component } from '@angular/core';
import { EcoStoreProductsFeature } from '@plastik/eco-store/products/feature';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [EcoStoreProductsFeature],
  template: `
    <h1>Our Products</h1>
    <eco-store-products-feature></eco-store-products-feature>
  `,
})
export class ProductsPageComponent {}
```

## Components

### EcoStoreProductsFeature

The main component that displays the products grid.

#### Selector

```html
<eco-store-products-feature></eco-store-products-feature>
```

#### Inputs

None

#### Outputs

None

#### Example

```html
<eco-store-products-feature></eco-store-products-feature>
```

## Running unit tests

Run `nx test eco-store-products-feature` to execute the unit tests via [Jest](https://jestjs.io/).
