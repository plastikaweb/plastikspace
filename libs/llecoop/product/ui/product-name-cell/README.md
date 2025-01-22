# ui-product-name-cell

- [ui-product-name-cell](#ui-product-name-cell)
  - [Description](#description)
  - [Dependencies](#dependencies)
  - [Inputs](#inputs)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A component that displays product information in a cell format, typically used in product tables.
It shows the product name as a clickable link, optional product info, and additional details like provider and origin in a responsive layout.

The component accepts a `LlecoopProduct` object and renders its properties in a structured format.

```typescript
interface LlecoopProduct {
  id: string | number;
  name: string;
  info?: string;
  provider?: string;
  origin?: string;
}
```

## Dependencies

- RouterLink

## Inputs

| Name      | Type             | Description                                             | Default   |
| --------- | ---------------- | ------------------------------------------------------- | --------- |
| `product` | `LlecoopProduct` | Product object containing name, info, and other details | undefined |

## How to use

- Import the `UiProductNameCellComponent` in your parent standalone component or module.

```typescript
// component ts
export class ProductListComponent {
  product: LlecoopProduct = {
    id: 1,
    name: 'Organic Tomatoes',
    info: 'Fresh from local farms',
    provider: 'Local Farm Co',
    origin: 'Barcelona',
  };
}
```

```html
<!-- component template -->
<plastik-ui-product-name-cell [product]="product"> </plastik-ui-product-name-cell>
```

## Running unit tests

Run `nx test ui-product-name-cell` to execute the unit tests.
