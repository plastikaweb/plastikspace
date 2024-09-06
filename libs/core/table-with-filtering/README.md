# core-table-with-filtering

- [core-table-with-filtering](#core-table-with-filtering)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A core feature component that displays a table with filtering capabilities.

## How to use

1. Load the `TableWithFilteringComponent` in a route.
2. Set providers for `STORE_TOKEN` and `TABLE_WITH_FILTERING_FACADE` to be used in the feature route with the `TableWithFilteringComponent`.

```typescript
import { STORE_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';

export const exampleFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'Example title',
    component: TableWithFilteringComponent,
    providers: [
      {
        provide: STORE_TOKEN,
        useExisting: ExampleStore,
      },
      {
        provide: TABLE_WITH_FILTERING_FACADE,
        useExisting: ExampleListFacadeService,
      },
    ],
  },
];
```

> The `TABLE_WITH_FILTERING_FACADE` is a facade service that implements the `TableWithFilteringFacade` interface:
>
> ```typescript
> export interface TableWithFilteringFacade<T extends BaseEntity> {
>   tableStructure: Signal<TableControlStructure<T>>;
>   tableData: Signal<T[]>;
>   count: Signal<number>;
>   viewName: string;
> }
> ```

## Running unit tests

Run `nx test core-table-with-filtering` to execute the unit tests.
