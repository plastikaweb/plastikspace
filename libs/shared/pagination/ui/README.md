# @plastik/shared/pagination/ui

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Material](https://img.shields.io/badge/Material-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/pagination/ui](#plastiksharedpaginationui)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Advanced Usage with Directives](#advanced-usage-with-directives)
  - [API Reference](#api-reference)
    - [`PaginationComponent`](#paginationcomponent)
  - [Running unit tests](#running-unit-tests)

## Description

The **Pagination UI** library provides a reusable, accessible, and theme-aware pagination component. Built with Angular Signals and Angular Material, it offers a robust solution for handling large datasets.

## Features

- **Signal-Based**: Uses Angular Signals for internal state management.
- **Material Design**: Seamless integration with Angular Material theming.
- **Extensible**: Supports custom navigation directives for automatic URL or backend synchronization.
- **Type Safe**: Fully typed inputs and outputs.
- **OnPush**: Optimized for performance with `OnPush` change detection.

## Installation

This library is part of the shared UI scope. Import `PaginationComponent` directly into your standalone components.

## Usage

### Basic Usage

Handle page changes manually in your component or store.

```html
<plastik-pagination
  [pageSize]="10"
  [pageIndex]="0"
  [pageSizeOptions]="[5, 10, 25]"
  (pageChange)="onPageChange($event)">
</plastik-pagination>
```

### Advanced Usage with Directives

Use the `pocketbasePaginationNavigation` directive to automatically sync state with URL query parameters and PocketBase.

```html
<plastik-pagination
  [pageSize]="store.perPage()"
  [pageIndex]="store.page()"
  [pageSizeOptions]="[10, 20, 50]"
  pocketbasePaginationNavigation
  [queryParamsHandling]="'merge'">
</plastik-pagination>
```

## API Reference

### `PaginationComponent`

**Selector:** `<plastik-pagination>`

| Input             | Type       | Required | Description                                    |
| :---------------- | :--------- | :------- | :--------------------------------------------- |
| `pageSize`        | `number`   | Yes      | Number of items per page.                      |
| `pageIndex`       | `number`   | Yes      | Current page index (0-based).                  |
| `pageSizeOptions` | `number[]` | No       | Array of page size options (e.g., `[10, 20]`). |

| Output       | Type        | Description                                   |
| :----------- | :---------- | :-------------------------------------------- |
| `pageChange` | `PageEvent` | Emitted when page index or page size changes. |

## Running unit tests

Run `nx test shared-pagination-ui` to execute the unit tests.
