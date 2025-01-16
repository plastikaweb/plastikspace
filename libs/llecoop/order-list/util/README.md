# llecoop-order-list-util

- [llecoop-order-list-util](#llecoop-order-list-util)
  - [Description](#description)
  - [Usage](#usage)
    - [formatUserOrderDeliveryDate](#formatuserorderdeliverydate)
    - [isLlecoopUserOrder](#isllecoopuserorder)
    - [formatOrderStatus](#formatorderstatus)
  - [Running unit tests](#running-unit-tests)

## Description

Utility functions for handling order list operations in the Llecoop application.

## Usage

### formatUserOrderDeliveryDate

Formats the delivery date for a user order.

**Parameters:**

- `order: Partial<LlecoopUserOrder>` - The user order to format the delivery date for.
- `sanitizer: DomSanitizer` - The Angular sanitizer service.

**Returns:** `SafeHtml` - The formatted delivery date as a SafeHtml object.

```typescript
const result = formatUserOrderDeliveryDate(order, sanitizer);
```

### isLlecoopUserOrder

Type guard that checks if the passed value is a LlecoopUserOrder.

**Parameters:**

- `value: LlecoopOrder | LlecoopUserOrder` - The value to check

**Returns:** `value is LlecoopUserOrder` - True if the value is a LlecoopUserOrder, false otherwise

```typescript
const result = isLlecoopUserOrder(order);
```

### formatOrderStatus

Formats the status of an order and returns it as a component configuration.

**Type Parameters:**

- `T` - Type extending LlecoopUserOrder | LlecoopOrder

**Parameters:**

- `key: string` - The key of the column (default: 'status').
- `title: Capitalize<string>` - The title of the column (default: 'Estat').
- `propertyPath: string` - The property path of the column (default: 'status').
- `cssClasses: string[]` - The CSS classes of the column (default: [`min-w-[145px]`]).
- `sorting: boolean` - Whether the column is sortable or not (default: true).

**Returns:** `TableColumnFormatting<T, 'COMPONENT'>` - The formatted column configuration.

```typescript
const result = formatOrderStatus<LlecoopUserOrder>();
```

The function returns a configuration object that includes:

- Column metadata (key, title, propertyPath)
- Styling configuration (cssClasses)
- Sorting behavior
- Component-based formatting with UiOrderStatusChipComponent

## Running unit tests

Run `nx test llecoop-order-list-util` to execute the unit tests.
