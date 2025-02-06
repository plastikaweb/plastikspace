# core-table-with-filtering

- [core-table-with-filtering](#core-table-with-filtering)
  - [Description](#description)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A core feature component that displays a table with filtering capabilities.

## How to use

1. Load the `TableWithFilteringComponent` in a route.
2. Set providers for `STORE_TOKEN`, `TABLE_WITH_FILTERING_FACADE`, `TABLE_TOKEN`, and `FORM_TOKEN` to be used in the feature route with the `TableWithFilteringComponent`.

```typescript
import { STORE_TOKEN } from '@plastik/core/entities';
import { TABLE_WITH_FILTERING_FACADE, TableWithFilteringComponent } from '@plastik/core/list-view';
import { TABLE_TOKEN } from '@plastik/shared/table/entities';
import { FORM_TOKEN } from '@plastik/core/entities';

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
      {
        provide: TABLE_TOKEN,
        useExisting: ExampleSearchFeatureTableConfig,
      },
      {
        provide: FORM_TOKEN,
        useValue: getExampleSearchFeatureFormConfig(),
      },
    ],
  },
];
```

> The `STORE_TOKEN` is a token that provides a `StoreFeatureToken` object to configure the store.
>
> ```typescript
> export interface StoreFeatureToken {
>   sorting: Signal<TableSorting>;
>   count: Signal<number>;
>   entities: Signal<any[]>;
>   setSorting: (sorting: TableSorting) => void;
> }
> ```
>
> The `TABLE_WITH_FILTERING_FACADE` is a facade service that implements the `TableWithFilteringFacade` interface:
>
> ```typescript
> export interface TableWithFilteringFacade<T extends BaseEntity> {
>   tableDefinition: Signal<TableControlStructure<T>>;
>   tableData: Signal<T[]>;
>   count: Signal<number>;
>   viewName: string;
> }
> ```
>
> The `TABLE_TOKEN` is a token that provides a `TableStructureConfig` object to configure the table structure.
>
> ```typescript
> export interface TableStructureConfig<T> {
>   getTableDefinition(
>     overwrite?: ({ key: string } & Record<string, string>) | null,
>     tableControlStructureMerge?: Partial<TableDefinition<T>>
>   ): TableDefinition<T>;
> }
> ```
>
> The `FORM_TOKEN` is a token that provides a `FormConfig` object to configure the form structure.
>
> ```typescript
> export interface FormConfig<T> {
>   getConfig: (editMode?: boolean, extra?: unknown) => FormlyFieldConfig[];
>   getExtraActions?: (model: T, editMode?: boolean) => ExtraFormAction<T>[];
>   executeAction?: (extraFormAction: ExtraFormAction<T>, element$: Observable<T>) => void;
>   getExtraSubmitActions?: (editMode: boolean) => ExtraSubmitFormAction<T>[];
>   getSubmitFormConfig?: (editMode?: boolean) => SubmitFormConfig;
>   getFormFullWidth?: boolean;
> }
> ```

## Running unit tests

Run `nx test core-table-with-filtering` to execute the unit tests.
