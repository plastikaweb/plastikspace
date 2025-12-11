# eco-store-product-card

- [eco-store-product-card](#eco-store-product-card)
  - [Description](#description)
  - [Components](#components)
    - [EcoStoreProductCardComponent](#ecostoreproductcardcomponent)
      - [Usage](#usage)
      - [Inputs](#inputs)
      - [Outputs](#outputs)
    - [EcoStoreProductCardQuantityControlComponent](#ecostoreproductcardquantitycontrolcomponent)
      - [Features](#features)
      - [Usage](#usage-1)
      - [Inputs](#inputs-1)
      - [Outputs](#outputs-1)

## Description

Reusable product card components for the Eco Store application.

## Components

### EcoStoreProductCardComponent

A card displaying product details, image, price, and a quantity control.

#### Usage

```html
<eco-store-product-card
  [product]="product"
  [isFirst]="isFirst"
  (addToCart)="onAddToCart($event)"
  (toggleFavorite)="onToggleFavorite($event)">
</eco-store-product-card>
```

#### Inputs

| Name      | Type                              | Required | Description                                                           |
| :-------- | :-------------------------------- | :------- | :-------------------------------------------------------------------- |
| `product` | `EcoStoreProductWithCategoryName` | Yes      | The product data to display.                                          |
| `isFirst` | `boolean`                         | Yes      | Whether this is the first card in a list (used for LCP optimization). |

#### Outputs

| Name             | Type                               | Description                                  |
| :--------------- | :--------------------------------- | :------------------------------------------- |
| `addToCart`      | `{ id: string; quantity: number }` | Emitted when the quantity changes.           |
| `toggleFavorite` | `string`                           | Emitted when the favorite button is clicked. |

### EcoStoreProductCardQuantityControlComponent

A specialized control for managing product quantity with support for different unit types, increments, and limits.

#### Features

- Handles different unit types (e.g., kg, units).
- Respects minimum and maximum quantity limits.
- Supports manual input and increment/decrement buttons.
- **Visual Feedback**: Shows a shadow on hover (aligned with Tailwind `shadow-sm`) when interacting with the card.

#### Usage

```html
<eco-store-product-card-quantity-control
  [product]="product"
  [quantity]="quantity"
  (quantityChange)="onQuantityChange($event)">
</eco-store-product-card-quantity-control>
```

#### Inputs

| Name       | Type                              | Default | Description                               |
| :--------- | :-------------------------------- | :------ | :---------------------------------------- |
| `product`  | `EcoStoreProductWithCategoryName` | -       | The product context for limits and steps. |
| `quantity` | `number`                          | `0`     | The current quantity.                     |

#### Outputs

| Name             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `quantityChange` | `number` | Emitted when the quantity changes. |
