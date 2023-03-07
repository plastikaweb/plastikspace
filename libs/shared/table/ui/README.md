# shared-table-ui

## Description

A container component to inject a configuration object and a data object to create a table automatically.

## HTML element

`<plastik-shared-table>`

## Material Table

It uses internally [Material Table](https://material.angular.io/components/table/overview).

## Inputs

| Name               | Type                                          | Description                                                            | Default |
| ------------------ | --------------------------------------------- | ---------------------------------------------------------------------- | ------- |
| `data`             | `<T[]>`                                       | The data to fill the table with a generic type annotation.             | []      |
| `columnProperties` | `TableColumnFormatting<T, FormattingTypes>[]` | Table structure skeleton.                                              |         |
| `resultsLength`    | `number`                                      | The total number of items available for the current table data fields. |         |

## Example

```typescript
# table model

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

# data from API server

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

# Table columns formatting configuration

const index: TableColumnFormatting<Data, FormattingTypes.CUSTOM> = {
  key: 'index',
  title: '',
  propertyPath: '',
  cssClasses: 'max-w-[4rem] lg:max-w-[10rem]',
  formatting: {
    type: FormattingTypes.CUSTOM,
    execute: (_, __, index) => String(index),
  },
};

const id: TableColumnFormatting<Data, FormattingTypes.TEXT> = {
  key: 'id',
  title: 'ID',
  propertyPath: 'id',
  formatting: {
    type: FormattingTypes.TEXT,
  },
};

const date: TableColumnFormatting<Data, FormattingTypes.DATE> = {
  key: 'startTime',
  title: 'Created',
  propertyPath: 'startTime',
  formatting: {
    type: FormattingTypes.DATE,
    extras: { numberDigitsInfo: 'longDate' },
  },
};

const columnProperties: TableColumnFormatting<Data, FormattingTypes>[] = [
  index,
  id,
  date,
];

export class DataFeatureSearchTableConfig {
  static getTableStructure(): TableControlStructure<Data> {
    return {
      ...defaultTableConfig,
      columnProperties,
    };
  }
}

resultsLength = 100; # This information normally will come from server

```

```html
# template

<plastik-shared-table [data]="data" [columnProperties]="tableStructure.columnProperties" [resultsLength]="resultsLength">
</plastik-shared-table>
```

## Running unit tests

Run `nx test shared-table-ui` to execute the unit tests.

## Useful links

- [Material Table](https://material.angular.io/components/table/overview)
