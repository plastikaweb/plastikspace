# input-table

- [input-table](#input-table)
  - [Description](#description)
  - [Features](#features)
  - [Usage](#usage)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Usage with Formly](#usage-with-formly)
  - [Running unit tests](#running-unit-tests)

## Description

The `input-table` component is a reusable Angular component designed to handle tabular data input. It integrates with Angular forms and provides a flexible way to manage table data with various configurations.

The `input-table-type` component is a formly type that can be used with Angular Formly to create and manage table data.

## Features

- **ControlValueAccessor** implementation for seamless form integration.
- Customizable table columns and data formatting.
- Pagination control with visibility options.
- Row selection and conditional styling.
- Reactive signals for managing component state.

## Usage

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

## Inputs

- `tableData`: The data to be displayed in the table.
- `tableColumnProperties`: Configuration for table columns.
- `tableSorting`: Sorting configuration for the table.
- `tableActions`: Actions available for table rows.
- `tableNoPagination`: Boolean to disable pagination.
- `label`: Label for the table.

## Outputs

- `onGetChangedData`: Method emitted when table data changes.

For more detailed usage and examples, refer to the component documentation.

## Usage with Formly

Formly Props:

```typescript
interface InputTableProps extends FormlyFieldProps {
  tableDefinition: Signal<TableDefinition<BaseEntity>>;
  tableRowValueConditionFn: (element: BaseEntity) => boolean;
}
```

```typescript
const formly: FormlyFieldConfig = {
  key: 'table',
  type: 'table',
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
  },
};
```

## Running unit tests

Run `nx test input-table` to execute the unit tests.
