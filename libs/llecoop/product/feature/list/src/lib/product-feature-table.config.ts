import { inject, Injectable } from '@angular/core';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { UiProductNameCellComponent } from '@plastik/llecoop/product-name-cell';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';
import { categoryNameCell, createdAt, updatedAt } from '@plastik/llecoop/util';
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
export class LlecoopProductSearchFeatureTableConfig
  implements TableStructureConfig<LlecoopProduct>
{
  readonly #store = inject(llecoopProductStore);

  readonly #name: TableColumnFormatting<LlecoopProduct, 'COMPONENT'> = {
    key: 'name',
    title: 'Nom',
    pathToKey: 'name',
    sorting: 'normalizedName',
    sticky: true,
    formatting: {
      type: 'COMPONENT',
      execute: (_, product) => {
        if (!product) {
          throw new Error('Product is required');
        }
        return {
          component: UiProductNameCellComponent,
          inputs: { product, nameStyle: 'uppercase font-bold' },
        };
      },
    },
  };

  readonly #stock: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'stock',
    title: 'Stock',
    pathToKey: 'stock',
    cssClasses: ['hidden @lg:flex @lg:min-w-[70px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, product) => {
        return !value ? '-' : `${value} ${product?.unit?.type === 'weight' ? 'kg' : 'u.'}`;
      },
    },
  };

  readonly #createdAt = createdAt<LlecoopProduct>();
  readonly #updatedAt = updatedAt<LlecoopProduct>();

  readonly #columnProperties: TableColumnFormatting<LlecoopProduct, FormattingTypes>[] = [
    this.#name,
    categoryNameCell<LlecoopProduct>({
      key: 'category',
      title: 'Categoria',
      pathToKey: 'category.name',
      sorting: 'categoryName',
      cssClasses: ['hidden @xl:flex @xl:min-w-[150px]'],
    }),
    this.#stock,
    this.#createdAt,
    this.#updatedAt,
  ];

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);
    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      sort: this.#store.sorting,
      pagination: this.#store.pagination,
      filter: this.#store.filter,
      caption: 'Llistat de productes',
      getData: () => this.#store.entities(),
      count: this.#store.count,
      extraRowStyles: (product: LlecoopProduct) => {
        return !product.isAvailable ? 'marked-ko' : '';
      },
      actionsColStyles: 'max-w-[160px]',
      actions: {
        SET_AVAILABILITY: {
          visible: () => true,
          description: () => 'Canviar la disponibilitat del producte',
          order: 1,
          icon: (product: LlecoopProduct) => (!product.isAvailable ? 'cancel' : 'check_circle'),
          execute: (product: LlecoopProduct) => {
            this.#store.update({ ...product, isAvailable: !product.isAvailable });
          },
        },
        EDIT: {
          visible: () => true,
          description: () => 'Edita el producte',
          order: 2,
        },
        DELETE: {
          visible: () => true,
          description: () => 'Elimina el producte',
          order: 3,
        },
      },
    } as TableDefinition<LlecoopProduct>;
  }
}
