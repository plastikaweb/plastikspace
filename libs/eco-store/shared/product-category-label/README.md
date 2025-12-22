# @plastik/eco-store/shared/product-category-label

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Design System](https://img.shields.io/badge/design_system-%23FFD700.svg?style=for-the-badge&logo=material-design&logoColor=black)

- [@plastik/eco-store/shared/product-category-label](#plastikeco-storesharedproduct-category-label)
  - [Description](#description)
  - [Installation](#installation)
  - [Usage](#usage)
    - [EcoStoreProductCategoryLabelComponent](#ecostoreproductcategorylabelcomponent)
  - [Running unit tests](#running-unit-tests)

## Description

A reusable component for displaying product category labels with a colored dot and text. Supports different sizes and integrates with the Eco Store design system.

## Installation

```ts
import { EcoStoreProductCategoryLabelComponent } from '@plastik/eco-store/shared/product-category-label';
```

## Usage

### EcoStoreProductCategoryLabelComponent

Selector: `eco-store-product-category-label`

#### Inputs

| Input   | Type                          | Default      | Description                          |
| ------- | ----------------------------- | ------------ | ------------------------------------ |
| `name`  | `string \| null \| undefined` | **Required** | The name of the category to display. |
| `color` | `string \| null \| undefined` | `'#000'`     | The color for the dot and text.      |
| `size`  | `'sm' \| 'md' \| 'lg'`        | `'sm'`       | The size of the label.               |

#### Example

```html
<eco-store-product-category-label
  [name]="product().categoryName"
  [color]="product().categoryColor"
  [size]="'md'" />
```

## Running unit tests

Run `nx test eco-store-shared-product-category-label` to execute the unit tests via Jest.
