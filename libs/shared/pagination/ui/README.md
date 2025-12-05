# pagination-ui

- [pagination-ui](#pagination-ui)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
  - [Customizing pageChange behavior with directives](#customizing-pagechange-behavior-with-directives)
  - [API](#api)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
  - [Styling](#styling)
  - [Useful links](#useful-links)

## Description

A reusable Angular pagination component built with Material Design and signals.

## Features

- Standalone component (`PaginationComponent`) using Angular signals for internal state.
- Supports custom page size options, current page index, and total length.
- Emits a `pageChange` output (`PageEvent`) that can be consumed by a `PaginationNavigationDirective`.
- Fully typed, OnPush change detection, and no template‑driven forms.
- Designed to be theme‑aware and easily styled.

## Usage

```html
<plastik-pagination
  [pageSize]="store.getPagination().perPage"
  [pageIndex]="store.getPagination().page"
  [pageSizeOptions]="store.paginationSizeOptions()"
  (pageChange)="store.setPagination($event)"></plastik-pagination>
```

## Customizing pageChange behavior with directives

The `PaginationComponent` emits a `pageChange` event. By default you can handle it directly in the template (as shown above).

If you want to centralize navigation logic—e.g., synchronize pagination with URL query parameters or a backend like PocketBase—you can attach a **standalone directive** to the same element:

```html
<plastik-pagination
  [pageSize]="store.getPagination().perPage"
  [pageIndex]="store.getPagination().page"
  [pageSizeOptions]="store.paginationSizeOptions()"
  pocketbasePaginationNavigation
  [queryParamsHandling]="'merge'">
</plastik-pagination>
```

- `pocketbasePaginationNavigation` extends `PaginationNavigationDirective<BasePocketBaseEntityPagination>` and implements `getPaginationParams` to produce the correct query‑params shape for PocketBase.
- The directive also exposes an optional `queryParamsHandling` input (default `'merge'`) to control how existing query parameters are merged.
- Because the directive handles the `pageChange` subscription internally, you no longer need to bind `(pageChange)` in the template.

You can create your own directive by extending `PaginationNavigationDirective<P>` and providing a custom `getPaginationParams` implementation.

## API

### Inputs

| Input             | Type       | Description                         |
| ----------------- | ---------- | ----------------------------------- |
| `pageSize`        | `number`   | Items per page (required).          |
| `pageIndex`       | `number`   | Zero‑based page index (required).   |
| `pageSizeOptions` | `number[]` | Options for the page‑size selector. |

### Outputs

| Output       | Type        | Description                                      |
| ------------ | ----------- | ------------------------------------------------ |
| `pageChange` | `PageEvent` | Emitted when the user changes page or page size. |

## Styling

The component uses Angular Material theming. You can customize colours via the standard Material theme variables or add custom CSS classes.

## Useful links

- [Angular Material Pagination](https://material.angular.io/components/paginator/overview)
