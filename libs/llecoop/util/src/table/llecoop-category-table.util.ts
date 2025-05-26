import { BaseEntity } from '@plastik/core/entities';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UiCategoryNameCellComponent } from '@plastik/llecoop/category-name-cell';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { FormattingComponentOutput } from '@plastik/shared/formatters';
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
  partialFormat: Partial<TableColumnFormatting<T, 'COMPONENT', UiCategoryNameCellComponent>> = {
    key: 'name',
    title: 'Categoria',
    pathToKey: 'category.name',
  },
  withLink = false,
  nameStyle = ''
): TableColumnFormatting<T, 'COMPONENT', UiCategoryNameCellComponent> {
  return {
    key: partialFormat.key ?? 'name',
    title: (partialFormat.title as Capitalize<string>) ?? 'Categoria',
    pathToKey: partialFormat.pathToKey ?? 'category.name',
    formatting: {
      type: 'COMPONENT',
      execute: (_, element) => {
        const category = (element?.['category'] as LlecoopProductCategory | undefined) ?? null;

        return {
          component: UiCategoryNameCellComponent,
          inputs: {
            category,
            withLink,
            nameStyle,
          },
        } as FormattingComponentOutput<UiCategoryNameCellComponent>;
      },
    },
    ...partialFormat,
  };
}
