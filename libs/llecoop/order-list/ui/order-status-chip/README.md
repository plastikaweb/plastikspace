# ui-order-status-chip

- [ui-order-status-chip](#ui-order-status-chip)
  - [Description](#description)
  - [Dependencies](#dependencies)
  - [Inputs](#inputs)
  - [How to use](#how-to-use)
    - [Import](#import)
    - [Basic Usage](#basic-usage)
  - [Running unit tests](#running-unit-tests)

## Description

A reusable component for displaying order status using Material's chip component. It displays an icon and label with customizable styling.

## Dependencies

- MatChipsModule
- MatIconModule
- NgClass

## Inputs

| Name         | Type     | Description                             | Default     | Required |
| ------------ | -------- | --------------------------------------- | ----------- | -------- |
| `chipClass`  | `string` | CSS classes to apply to the status chip | 'my-sm'     | No       |
| `iconClass`  | `string` | CSS classes to apply to the status icon |             | Yes      |
| `icon`       | `string` | Material icon name to display           |             | Yes      |
| `label`      | `string` | Text to display next to the icon        |             | Yes      |
| `labelClass` | `string` | CSS classes to apply to the label text  | 'font-bold' | No       |

## How to use

### Import

Import the `UiOrderStatusChipComponent` in your parent standalone component or module:

```typescript
import { UiOrderStatusChipComponent } from '@plastik/llecoop/order-status-chip';

@Component({
  // ...
  imports: [UiOrderStatusChipComponent]
})
```

### Basic Usage

```typescript
// component.ts
export class OrderStatusComponent {
  status = {
    iconClass: 'text-info',
    icon: 'hourglass_empty',
    label: 'Pending',
    labelClass: 'font-bold text-sm',
  };
}
```

```html
<!-- component.html -->
<plastik-ui-order-status-chip
  [iconClass]="status.iconClass"
  [icon]="status.icon"
  [label]="status.label"
  [labelClass]="status.labelClass">
</plastik-ui-order-status-chip>
```

## Running unit tests

Run `nx test ui-order-status-chip` to execute the unit tests.
