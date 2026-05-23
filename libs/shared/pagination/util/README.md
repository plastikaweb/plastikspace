# pagination-util

- [pagination-util](#pagination-util)
  - [Overview](#overview)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Implementations](#implementations)
    - [PocketBase directive](#pocketbase-directive)
    - [Creating a custom directive](#creating-a-custom-directive)
  - [API Reference](#api-reference)
    - [PaginationNavigationDirective](#paginationnavigationdirective)
      - [Inputs](#inputs)
      - [Protected Methods (for subclasses)](#protected-methods-for-subclasses)
      - [Protected Properties](#protected-properties)
    - [PocketbasePaginationNavigationDirective](#pocketbasepaginationnavigationdirective)
      - [Inputs](#inputs-1)
      - [Return Type](#return-type)
      - [Behavior](#behavior)
  - [Useful links](#useful-links)

## Overview

A collection of Angular directives for handling pagination. This library provides a base abstract directive and concrete implementations for different backend systems.

## Features

- **Template Method Pattern**: Abstract base class with customizable parameter transformation
- **Type-safe**: Full TypeScript support with generic types for query parameters
- **URL Synchronization**: Automatic syncing of pagination state with URL query parameters
- **Configurable**: Control how query parameters are merged, preserved, or replaced
- **Lifecycle-aware**: Automatic subscription cleanup using `takeUntilDestroyed`
- **Backend-agnostic**: Easily extend for any backend (PocketBase, REST APIs, GraphQL, etc.)

## Architecture

```bash
PaginationNavigationDirective<P>         (Abstract base class)
         │
         ├─ Handles router navigation
         ├─ Subscribes to pageChange events
         ├─ Manages subscription lifecycle
         │
         └─→ getPaginationParams(event: PageEvent): P   (Abstract method)
                      │
                      └─ Implemented by concrete directives
                               │
                               ├─ PocketbasePaginationNavigationDirective
                               ├─ YourCustomDirective
                               └─ ...
```

## Implementations

### PocketBase directive

The library includes a ready-to-use directive for PocketBase backends:

```html
<plastik-pagination
  [pageSize]="store.getPagination().perPage"
  [pageIndex]="store.getPagination().page"
  [pageSizeOptions]="[10, 20, 50]"
  pocketbasePaginationNavigation
  [queryParamsHandling]="'merge'">
</plastik-pagination>
```

**What this does:**

- Automatically navigates to the correct URL when pagination changes
- Transforms Material's `PageEvent` (0-indexed) to PocketBase format (1-indexed)
- Resets to page 1 when page size changes
- Merges pagination params with existing query parameters

### Creating a custom directive

Extend `PaginationNavigationDirective<P>` for your own backend:

```typescript
import { Directive, input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PaginationNavigationDirective } from '@plastik/shared/pagination/util';

interface MyApiPagination {
  offset: number;
  limit: number;
}

@Directive({
  selector: '[myApiPaginationNavigation]',
})
export class MyApiPaginationNavigationDirective extends PaginationNavigationDirective<MyApiPagination> {
  pageSize = input.required<number>();

  protected getPaginationParams(event: PageEvent): MyApiPagination {
    return {
      offset: event.pageIndex * event.pageSize,
      limit: event.pageSize,
    };
  }
}
```

Then use it in your template:

```html
<plastik-pagination [pageSize]="20" [pageIndex]="0" myApiPaginationNavigation> </plastik-pagination>
```

## API Reference

### PaginationNavigationDirective<P>

**Abstract base directive** that handles pagination navigation logic.

#### Inputs

| Input                 | Type                  | Default   | Description                                                           |
| --------------------- | --------------------- | --------- | --------------------------------------------------------------------- |
| `queryParamsHandling` | `QueryParamsHandling` | `'merge'` | How to handle existing query params: `'merge'`, `'preserve'`, or `''` |

#### Protected Methods (for subclasses)

| Method                                           | Return Type | Description                                                 |
| ------------------------------------------------ | ----------- | ----------------------------------------------------------- |
| `abstract getPaginationParams(event: PageEvent)` | `P`         | Transform Material's PageEvent into backend-specific params |

#### Protected Properties

| Property    | Type                  | Description                                |
| ----------- | --------------------- | ------------------------------------------ |
| `router`    | `Router`              | Angular router instance                    |
| `paginator` | `PaginationComponent` | Reference to the host pagination component |

### PocketbasePaginationNavigationDirective

**Concrete implementation** for PocketBase backends.

#### Inputs

| Input                 | Type                  | Required | Description                                                                                                                               |
| --------------------- | --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `pageSize`            | `number`              | Yes      | Current page size (used for change detection)                                                                                             |
| `queryParamsHandling` | `QueryParamsHandling` | No       | Handling of query parameters updates. Defaults to `'merge'`. Can be used as a boolean attribute (empty string) to enable default merging. |

#### Return Type

```typescript
// From @plastik/core/entities
interface BasePocketBaseEntityPagination {
  perPage: number; // Items per page (min: 1)
  page: number; // Page number, 1-indexed (min: 1)
}
```

#### Behavior

- Converts Material's 0-indexed `pageIndex` to PocketBase's 1-indexed `page`
- Resets to page 1 when `pageSize` changes
- Ensures both `perPage` and `page` are at least 1

## Useful links

- [Angular Router Query Parameters](https://angular.io/guide/router#query-parameters)
- [PocketBase Pagination](https://pocketbase.io/docs/api-records/#list-view)
- [Material Paginator](https://material.angular.io/components/paginator/overview)
