# Sort Selector

- [Sort Selector](#sort-selector)
  - [Description](#description)
  - [Usage](#usage)
  - [API](#api)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
  - [Useful Links](#useful-links)

## Description

A reusable Angular component for selecting sort options, designed to work with PocketBase sort configurations but adaptable to other structures.

## Usage

Import `SortSelectorComponent` in your component or module.

```typescript
import { SortSelectorComponent } from '@plastik/shared/sort-selector';

@Component({
  standalone: true,
  imports: [SortSelectorComponent],
  template: `
    <plastik-sort-selector
      [options]="sortOptions"
      [currentSort]="currentSort"
      [translationPrefix]="'my.translation.prefix'"
      (sortChange)="onSortChange($event)">
    </plastik-sort-selector>
  `,
})
export class MyComponent {
  sortOptions: PocketBaseSortOptions = [
    { name: 'name', description: 'Name (A-Z)', value: 'name' },
    { name: '-created', description: 'Newest', value: '-created' },
  ];
  currentSort: BasePocketBaseEntitySort = {
    name: 'name',
    description: 'Name (A-Z)',
    value: 'name',
  };

  onSortChange(newSort: BasePocketBaseEntitySort) {
    this.currentSort = newSort;
    // trigger data reload
  }
}
```

## API

### Inputs

| Name                | Type                       | Required | Description                                       |
| :------------------ | :------------------------- | :------- | :------------------------------------------------ |
| `options`           | `PocketBaseSortOptions`    | Yes      | List of available sort options.                   |
| `currentSort`       | `BasePocketBaseEntitySort` | Yes      | The currently selected sort option.               |
| `translationPrefix` | `string`                   | Yes      | Prefix for translation keys used in the template. |

### Outputs

| Name         | Type                       | Description                                  |
| :----------- | :------------------------- | :------------------------------------------- |
| `sortChange` | `BasePocketBaseEntitySort` | Emits the selected sort option when changed. |

## Useful Links

- [Material Menu](https://material.angular.io/components/menu)
