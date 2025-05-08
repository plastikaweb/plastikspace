# input-table

## Table of Contents

- [input-table](#input-table)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Usage](#usage)
    - [HTML Element](#html-element)
    - [Module Setup](#module-setup)
    - [Formly Configuration](#formly-configuration)
    - [Basic Example](#basic-example)
  - [API Reference](#api-reference)
    - [Props Interface](#props-interface)
    - [Return Value](#return-value)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
  - [Running unit tests](#running-unit-tests)

## Description

The `input-table` component is a reusable Angular component designed to handle tabular data input. It integrates with Angular forms and provides a flexible way to manage table data with various configurations.

The `input-table-type` component is a formly type that can be used with Angular Formly to create and manage table data.

## Usage

### HTML Element

`<plastik-input-table>`

### Module Setup

To use the `input-table` component, import it into your Angular module and include it in your template:

```typescript
import { InputTableComponent } from './input-table.component';

@NgModule({
  declarations: [AppComponent],
  imports: [InputTableComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

In your template:

```html
<plastik-input-table
  [tableData]="data"
  [tableColumnProperties]="columnProperties"
  [tableSorting]="sortingConfig"
  [tableActions]="actions"
  [tableNoPagination]="noPagination"
  [label]="'Table Label'">
</plastik-input-table>
```

### Formly Configuration

The component type name is: `input-table-type`

### Basic Example

```typescript
const formly: FormlyFieldConfig = {
  key: 'table',
  type: 'input-table-type',
  props: {
    required: true,
    tableDefinition: {
      caption: 'Table',
      columnProperties: [
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          key: 'age',
          label: 'Age',
          type: 'number',
          required: true,
        },
      ],
      getData: () => this.data,
    },
    tableRowValueConditionFn: (element: BaseEntity) => element.age > 18,
  } as InputTableProps,
};
```

## API Reference

### Props Interface

```typescript
interface InputTableProps extends FormlyFieldProps {
  /**
   * Column definitions for the table
   */
  tableColumnProperties: TableColumnProperty[];

  /**
   * Sorting configuration
   */
  tableSorting?: {
    active: string;
    direction: 'asc' | 'desc';
  };

  /**
   * Disable pagination
   * @default false
   */
  tableNoPagination?: boolean;

  /**
   * Custom actions for table rows
   */
  tableActions?: TableAction[];

  /**
   * Label for the table
   */
  label?: string;
}

interface TableColumnProperty {
  /**
   * Key of the column in data object
   */
  key: string;

  /**
   * Display header text
   */
  header: string;

  /**
   * Optional formatter function
   */
  formatter?: (value: any) => string;
}

interface TableAction {
  /**
   * Action identifier
   */
  id: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Icon name
   */
  icon?: string;
}
```

### Return Value

Returns an array of objects representing the table data.

## Troubleshooting

### Common Issues

1. Sorting not working: Verify tableSorting configuration
2. Pagination issues: Check if tableNoPagination is set correctly
3. Column formatting problems: Ensure tableColumnProperties are properly defined
4. Performance issues with large datasets: Consider enabling virtual scrolling

## Running unit tests

Run `nx test input-table` to execute the unit tests.
