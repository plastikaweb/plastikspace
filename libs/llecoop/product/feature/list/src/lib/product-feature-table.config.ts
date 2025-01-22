import { inject, Injectable } from '@angular/core';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { UiProductNameCellComponent } from '@plastik/llecoop/product-name-cell';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { createdAt, productCategoryColumn, updatedAt } from '@plastik/llecoop/util';
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
  readonly #store = inject(LlecoopProductStore);

  readonly #name: TableColumnFormatting<LlecoopProduct, 'COMPONENT'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    formatting: {
      type: 'COMPONENT',
      execute: (_, product) => {
        if (!product) {
          throw new Error('Product is required');
        }
        return {
          component: UiProductNameCellComponent,
          inputs: { product },
        };
      },
    },
  };

  readonly #stock: TableColumnFormatting<LlecoopProduct, 'CUSTOM'> = {
    key: 'stock',
    title: 'Stock',
    propertyPath: 'stock',
    sorting: true,
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
    productCategoryColumn<LlecoopProduct>(),
    this.#stock,
    this.#createdAt,
    this.#updatedAt,
  ];

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      paginationVisibility: {
        hidePageSize: true,
        hideRangeLabel: true,
        hideRangeButtons: true,
        hidePaginationFirstLastButtons: true,
      },
      sort: this.#store.sorting,
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
            this.#store.update({
              product: { ...product, isAvailable: !product.isAvailable },
              showNotification: false,
            });
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
