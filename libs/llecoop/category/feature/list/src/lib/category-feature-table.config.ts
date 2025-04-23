import { inject, Injectable, Signal, signal } from '@angular/core';
import { UiCategoryNameCellComponent } from '@plastik/llecoop/category-name-cell';
import { llecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { createdAt, updatedAt } from '@plastik/llecoop/util';
import { FormattingTypes } from '@plastik/shared/formatters';
import {
  DEFAULT_TABLE_CONFIG,
  TableColumnFormatting,
  TableDefinition,
  TableStructureConfig,
} from '@plastik/shared/table/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategorySearchFeatureTableConfig
  implements TableStructureConfig<LlecoopProductCategory>
{
  readonly #store = inject(llecoopCategoryStore);

  readonly #name: TableColumnFormatting<LlecoopProductCategory, 'COMPONENT'> = {
    key: 'name',
    title: 'Nom',
    pathToKey: 'name',
    sorting: 'normalizedName',
    sticky: true,
    formatting: {
      type: 'COMPONENT',
      execute: (_, category) => {
        if (!category) {
          throw new Error('Category is required');
        }
        return {
          component: UiCategoryNameCellComponent,
          inputs: { category, nameStyle: 'uppercase font-bold', withLink: true },
        };
      },
    },
  };

  readonly #description: TableColumnFormatting<LlecoopProductCategory, 'TEXT'> = {
    key: 'description',
    title: 'Descripció',
    pathToKey: 'description',
    sorting: 'description',
    cssClasses: ['hidden @xl:flex @xl:min-w-[150px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #productCount: TableColumnFormatting<LlecoopProductCategory, 'TEXT'> = {
    key: 'productCount',
    title: 'Nre. de productes',
    pathToKey: 'productCount',
    sorting: 'productCount',
    cssClasses: ['max-w-[100px] @xl:max-w-none'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #createdAt = createdAt<LlecoopProductCategory>();
  readonly #updatedAt = updatedAt<LlecoopProductCategory>();

  readonly #columnProperties: Signal<
    TableColumnFormatting<LlecoopProductCategory, FormattingTypes>[]
  > = signal([this.#name, this.#description, this.#productCount, this.#createdAt, this.#updatedAt]);

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      sort: this.#store.sorting,
      pagination: this.#store.pagination,
      caption: 'Llistat de categories',
      count: this.#store.count,
      getData: () => this.#store.entities(),
      actionsColStyles: 'max-w-[135px]',
      rowHeight: '70px',
      actions: {
        EDIT: {
          visible: () => true,
          description: () => 'Edita la categoria',
          order: 1,
        },
        DELETE: {
          visible: () => true,
          description: () => 'Elimina la categoria',
          order: 2,
        },
      },
    } as TableDefinition<LlecoopProductCategory>;
  }
}
