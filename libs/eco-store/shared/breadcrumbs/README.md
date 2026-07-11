# @plastik/eco-store/breadcrumbs

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/eco-store/breadcrumbs](#plastikeco-storebreadcrumbs)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
    - [BreadcrumbItem Interface](#breadcrumbitem-interface)
    - [Component Inputs \& Outputs](#component-inputs--outputs)
    - [Example](#example)
  - [Running unit tests](#running-unit-tests)

## Description

The **Eco Store Breadcrumbs** library provides a responsive, accessible breadcrumb navigation bar for the Eco-Store application.

It renders a horizontal trail of links with an integrated back button, skeleton loading states, optional icons, and full i18n support via `ngx-translate`.

Part of the [**Eco-Store**](../../../../apps/eco-store/README.md) application.

## Features

- **Responsive nav bar**: Horizontal scrollable breadcrumb trail with hidden scrollbars on all viewports.
- **Back button**: Accessible icon button that emits a `goBack` event with configurable `aria-label`.
- **Router links**: Items with a `routerLink` render as `<a>` anchors; items without render as plain `<span>` (current page).
- **i18n support**: Items accept either a static `label` or an `ngx-translate` key (`labelKey` + optional `labelParams`).
- **Skeleton loading**: When `item.loading` is `true` a pulsing placeholder is shown; width is configurable via `skeletonWidth`.
- **Icon support**: Optional Material icon displayed on small-and-above breakpoints.

## Usage

### BreadcrumbItem Interface

```typescript
export interface BreadcrumbItem {
  label?: string;
  labelKey?: string;
  labelParams?: Record<string, unknown>;
  icon?: string;
  routerLink?: string[];
  queryParams?: Record<string, unknown>;
  loading?: boolean;
  skeletonWidth?: string;
}
```

### Component Inputs & Outputs

| API             | Type                      | Description                              |
| :-------------- | :------------------------ | :--------------------------------------- |
| `backAriaLabel` | `input<string>`           | Accessible label for the back button.    |
| `items`         | `input<BreadcrumbItem[]>` | Array of breadcrumb items to render.     |
| `goBack`        | `output<void>`            | Emitted when the back button is clicked. |

### Example

```typescript
protected readonly breadcrumbItems = computed((): BreadcrumbItem[] => [
  { labelKey: 'store.menu.store', icon: 'storefront', routerLink: ['/botiga'] },
  { label: product?.categoryName, routerLink: ['/botiga', product?.categorySlug] },
  { label: product?.name },
]);
```

```html
<eco-store-breadcrumbs
  [backAriaLabel]="'common.navigation.previous' | translate"
  [items]="breadcrumbItems()"
  (goBack)="returnToPreviousPage()" />
```

## Running unit tests

Run `nx test eco-store-breadcrumbs` to execute the unit tests via [Vitest](https://vitest.dev/).
