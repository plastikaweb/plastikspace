# @plastik/shared/sort-selector

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular Material](https://img.shields.io/badge/angular_material-%233f51b5?style=for-the-badge&logo=angular&logoColor=white)

- [@plastik/shared/sort-selector](#plastiksharedsort-selector)
  - [Description](#description)
  - [Usage](#usage)
  - [API](#api)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
  - [Resources](#resources)

## Description

A reusable Angular component for selecting **sort options**, designed to work with PocketBase sort configurations but adaptable to other structures.

## Usage

Import `SortSelectorComponent` in your component or module.

```typescript
import { Component } from '@angular/core';
import { SortMenuOptions, SortConfig } from '@plastik/core/entities';
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
  sortOptions: SortMenuOptions = {
    name: [
      { id: 1, direction: 'asc', description: 'Name (A-Z)', icon: 'sort_by_alpha' },
      { id: 2, direction: 'desc', description: 'Name (Z-A)', icon: 'sort_by_alpha' },
    ],
    date: [
      { id: 3, direction: 'desc', description: 'Newest', icon: 'access_time' },
      { id: 4, direction: 'asc', description: 'Oldest', icon: 'access_time' },
    ],
  };
  currentSort: SortConfig = { active: 'date', direction: 'desc' };

  onSortChange(newSort: SortConfig) {
    this.currentSort = newSort;
  }
}
```

## API

### Inputs

| Name                | Type                     | Required | Description                                                                                            |
| :------------------ | :----------------------- | :------- | :----------------------------------------------------------------------------------------------------- |
| `options`           | `SortMenuOptions`        | Yes      | Map of available sort options.                                                                         |
| `currentSort`       | `SortConfig`             | Yes      | The currently selected sort option.                                                                    |
| `translationPrefix` | `string`                 | Yes      | Prefix for translation keys used in the template.                                                      |
| `orderBy`           | `SortSelectorKeyValueFn` | No       | Optional function to customize the order of sort options. Defaults to ordering by the first item's ID. |

### Outputs

| Name         | Type         | Description                                  |
| :----------- | :----------- | :------------------------------------------- |
| `sortChange` | `SortConfig` | Emits the selected sort option when changed. |

## Resources

- [Material Menu](https://material.angular.io/components/menu)
