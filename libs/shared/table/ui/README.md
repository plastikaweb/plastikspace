# shared-table-ui

- [shared-table-ui](#shared-table-ui)
  - [Description](#description)
  - [HTML element](#html-element)
  - [Material Table](#material-table)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Example](#example)
    - [How to style](#how-to-style)
    - [Set global values for paginator](#set-global-values-for-paginator)
  - [Running unit tests](#running-unit-tests)
  - [Useful links](#useful-links)

## Description

A container component to inject a configuration object and a data object to create a table automatically.

## HTML element

`<plastik-shared-table>`

## Material Table

It uses internally [Material Table](https://material.angular.io/components/table/overview).

## Inputs

| Name                      | Type                                                     | Description                                                            | Default                                    |
| ------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| `data`                    | `<T[]>`                                                  | The data to fill the table with a generic type annotation.             | []                                         |
| `columnProperties`        | `TableColumnFormatting<T, FormattingTypes>[]`            | Table structure skeleton.                                              | Required                                   |
| `resultsLength`           | `number`                                                 | The total number of items available for the current table data fields. | Required                                   |
| `sort`                    | `TableSorting`                                           | The sorting configuration based on column and direction.               |                                            |
| `pagination`              | `PageEventConfig`                                        | The table pagination configuration.                                    |                                            |
| `noPagination`            | `boolean`                                                | Remove pagination component to the table.                              | false                                      |
| `paginationVisibility`    | `Partial<TablePaginationVisibility>`                     | Pagination visibility configuration.                                   | All properties are set to false by default |
| `caption`                 | `string`                                                 | Main title of the table.                                               |                                            |
| `actions`                 | `TableControlAction<T>`                                  | Table actions. configuration.                                          |                                            |
| `filterCriteria`          | `Record<string, string>`                                 | Table filter criteria configuration.                                   |                                            |
| `filterCriteriaPredicate` | `(data: T, criteria: Record<string, string>) => boolean` | Table filter criteria predicate.                                       |                                            |
| `extraRowStyles`          | `(element: T) => string`                                 | Table extra row styles configuration.                                  |                                            |
| `actionsColStyles`        | `string`                                                 | Table actions column styles configuration.                             | ''                                         |
| `rowHeight`               | `string`                                                 | Table row height configuration.                                        | 'unset'                                    |
| `expandable`              | `boolean`                                                | Table has expandable row behavior.                                     | false                                      |
| `expandableElementId`     | `EntityId\string\null`                                   | Table expandable element id.                                           | null                                       |
| `expandedDetailTpl`       | `TemplateRef<unknown>\null`                              | Table expandable element reference.                                    | null                                       |

## Outputs

| Name               | Type                            | Description                               |
| ------------------ | ------------------------------- | ----------------------------------------- |
| `changePagination` | `EventEmitter<PageEventConfig>` | emits the pagination table configuration. |
| `changeSorting`    | `EventEmitter<TableSorting>`    | emits the sorting configuration.          |
| `delete`           | `EventEmitter<T>`               | emits the delete action for a row.        |
| `getChangedData`   | `T/undefined`                   | emits the changed data for a row.         |

## Example

```typescript
// table model

interface Data {
  id: string;
  title: string;
  startTime: string;
  percentage: number;
  parent: {
    approved: boolean;
    child: {
      title: string;
    };
  }
}

// data from API server

data: Data[] = [
  {
    id: '1',
    title: 'one',
    startingTime: '2021-10-01T00:00:00+00:00',
    percentage: 82,
    parent: {
      approved: true;
      child: {
        title: 'Row 1',
      }
    }
  },
  {
    id: '2',
    title: 'two',
    startingTime: '2021-11-01T00:00:00+00:00',
    percentage: 55,
    parent: {
      approved: false;
      child: {
        title: 'Row 2',
      }
    }
  }
];

// Table columns formatting configuration

const index: TableColumnFormatting<Data, CUSTOM> = {
  key: 'index',
  title: '',
  pathToKey: '',
  cssClasses: 'max-w-[4rem] lg:max-w-[10rem]',
  formatting: {
    type: CUSTOM,
    execute: (_, __, index) => String(index),
  },
};

const id: TableColumnFormatting<Data, TEXT> = {
  key: 'id',
  title: 'ID',
  pathToKey: 'id',
  formatting: {
    type: TEXT,
  },
};

const date: TableColumnFormatting<Data, DATE> = {
  key: 'startTime',
  title: 'Created',
  pathToKey: 'startTime',
  formatting: {
    type: DATE,
    extras: { numberDigitsInfo: 'longDate' },
  },
};

const columnProperties: TableColumnFormatting<Data, FormattingTypes>[] = [
  index,
  id,
  date,
];

export class DataFeatureSearchTableConfig {
  static getTableDefinition(): TableDefinition<Data> {
    return {
      ...defaultTableConfig,
      columnProperties,
      caption: 'Feature table',
    };
  }
}

resultsLength = 100; # This information normally will come from server

onChangeTablePagination(tablePagination: TablePagination) {
  // do whatever is needed with this data
}
```

```html
<!-- template -->

<plastik-shared-table
  [data]="data"
  [columnProperties]="tableDefinition.columnProperties"
  [caption]="tableDefinition.caption"
  [sort]="tableDefinition.sort"
  [pagination]="tableDefinition.pagination"
  [resultsLength]="resultsLength"
  [paginationVisibility]="{
        hideRangeButtons: false,
        hideRangeLabel: true,
      }"
  (changePagination)="onChangeTablePagination($event)">
</plastik-shared-table>
```

### How to style

You can overwrite the styles from your main application declaring these CSS variables in your app `styles/_theme.scss` file:

```css
-  --plastik-mdc-table-row-min-height: 120px;
```

### Set global values for paginator

Provide [MAT_PAGINATOR_DEFAULT_OPTIONS](https://material.angular.io/components/paginator/api#MAT_PAGINATOR_DEFAULT_OPTIONS) token with the desired values.

```typescript
{
  provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
  useValue: {
    pageSize: 10,
    pageSizeOptions: [5, 10, 25],
    showFirstLastButtons: false,
  },
}
```

## Running unit tests

Run `nx test shared-table-ui` to execute the unit tests.

## Useful links

- [Material Table](https://material.angular.io/components/table/overview)
- [Material Paginator](https://material.angular.io/components/paginator/overview)
- [Material Paginator Default Options](https://material.angular.io/components/paginator/api#MAT_PAGINATOR_DEFAULT_OPTIONS)
