import { BaseEntity } from '@plastik/core/entities';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UiCategoryNameCellComponent } from '@plastik/llecoop/category-name-cell';
import { TableColumnFormatting } from '@plastik/shared/table/entities';

/**
 * @description Creates a table column formatting configuration for name category.
 * @template T - The type of the entity extending BaseEntity.
 * @param {Partial<TableColumnFormatting<T, 'COMPONENT'>>} partialFormat - Partial formatting options to override the defaults.
 * @param {boolean} [withLink] - Whether to add a link to the name.
 * @param {string} [nameStyle] - The style to apply to the name.
 * @returns {TableColumnFormatting<T, 'COMPONENT'>} The table column formatting configuration.
 */
export function categoryNameCell<T extends BaseEntity>(
  partialFormat: Partial<TableColumnFormatting<T, 'COMPONENT'>> = {},
  withLink = false,
  nameStyle = ''
): TableColumnFormatting<T, 'COMPONENT'> {
  return {
    key: partialFormat.key ?? 'name',
    title: partialFormat.title ?? 'Categoria',
    pathToKey: partialFormat.pathToKey ?? 'category.name',
    formatting: {
      type: 'COMPONENT',
      execute: (_, element) => {
        return {
          component: UiCategoryNameCellComponent,
          inputs: element?.['category']
            ? { category: element['category'], nameStyle, withLink }
            : { category: null, nameStyle, withLink: false },
        };
      },
    },
    ...partialFormat,
  };
}
