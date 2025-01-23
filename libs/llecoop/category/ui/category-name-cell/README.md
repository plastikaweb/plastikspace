# ui-category-name-cell

- [ui-category-name-cell](#ui-category-name-cell)
  - [Description](#description)
  - [Dependencies](#dependencies)
  - [Inputs](#inputs)
  - [How to use](#how-to-use)
  - [Running unit tests](#running-unit-tests)

## Description

A component that displays category information in a cell format, typically used in category tables.
It shows the category name and additional details in a structured and responsive layout.

The component accepts a `LlecoopCategory` object and renders its properties in a structured format.

## Dependencies

- NgClass
- NgStyle
- RouterLink

## Inputs

| Name        | Type              | Description                                       | Default   |
| ----------- | ----------------- | ------------------------------------------------- | --------- |
| `category`  | `LlecoopCategory` | Category object containing name and other details | undefined |
| `withLink`  | `boolean`         | Whether to use RouterLink                         | `false`   |
| `nameStyle` | `string`          | CSS style for the category name                   | `''`      |

## How to use

- Import the `UiCategoryNameCellComponent` in your parent standalone component or module.

```typescript
// component ts
export class CategoryListComponent {
  category: LlecoopCategory = {
    id: 1,
    name: 'Vegetables',
    description: 'Fresh and organic',
    color: '#00ff00',
  };
}
```

```html
<!-- component template -->
<plastik-ui-category-name-cell [category]="category" [styleClass]="highlight">
</plastik-ui-category-name-cell>
```

## Running unit tests

Run `nx test ui-category-name-cell` to execute the unit tests.
