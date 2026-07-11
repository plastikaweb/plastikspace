# @plastik/eco-store/shared/favorite-button

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/shared/favorite-button](#plastikeco-storesharedfavorite-button)
  - [Description](#description)
  - [Installation](#installation)
  - [Usage](#usage)
    - [EcoStoreSharedFavoriteButtonComponent](#ecostoresharedfavoritebuttoncomponent)
      - [Inputs](#inputs)
      - [Outputs](#outputs)
      - [Example](#example)
  - [Running unit tests](#running-unit-tests)

## Description

A reusable **favorite button component** for the Eco Store application. It features a glass effect appearance and supports multiple sizes and styles.

## Installation

```ts
import { EcoStoreSharedFavoriteButtonComponent } from '@plastik/eco-store/shared/favorite-button';
```

## Usage

### EcoStoreSharedFavoriteButtonComponent

Selector: `eco-store-shared-favorite-button`

#### Inputs

| Input        | Type                           | Default   | Description                             |
| ------------ | ------------------------------ | --------- | --------------------------------------- |
| `isFavorite` | `boolean`                      | `false`   | Whether the item is currently favorite. |
| `ariaLabel`  | `string`                       | `''`      | Accessibility label for the button.     |
| `size`       | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'sm'`    | Size of the button.                     |
| `appearance` | `'glass' \| 'none'`            | `'glass'` | Visual appearance style.                |

#### Outputs

| Output   | Type                  | Description                                                                               |
| -------- | --------------------- | ----------------------------------------------------------------------------------------- |
| `toggle` | `EventEmitter<Event>` | Emitted when the button is clicked. Automatically prevents default and stops propagation. |

#### Example

```html
<eco-store-shared-favorite-button
  [isFavorite]="isFavorite()"
  [size]="'md'"
  (toggle)="onToggleFavorite($event)" />
```

## Running unit tests

Run `nx test eco-store-shared-favorite-button` to execute the unit tests via Vitest.
