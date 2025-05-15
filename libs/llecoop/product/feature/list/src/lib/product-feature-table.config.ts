import { inject, Injectable, Signal, signal } from '@angular/core';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { UiProductNameCellComponent } from '@plastik/llecoop/product-name-cell';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';
import { categoryNameCell, createdAt, updatedAt } from '@plastik/llecoop/util';
import { FormattingTypes } from '@plastik/shared/formatters';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
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

  readonly #image: TableColumnFormatting<LlecoopProduct, 'COMPONENT'> = {
    key: 'imgUrl',
    title: 'Imatge',
    pathToKey: 'imgUrl',
    cssClasses: ['flex min-w-[70px]'],
    formatting: {
      type: 'COMPONENT',
      execute: (value, product, index) => ({
        component: SharedImgContainerComponent,
        inputs: {
          src: value || 'https://fakeimg.pl/150x150?text=El+Llevat&font=lobster',
          width: 110,
          title: product?.name,
          lcpImage: index === 0,
          quality: 70,
        },
      }),
    },
  };

  readonly #name: TableColumnFormatting<LlecoopProduct, 'COMPONENT'> = {
    key: 'name',
    title: 'Nom',
    pathToKey: 'name',
    sorting: 'normalizedName',
    sticky: true,
    formatting: {
      type: 'COMPONENT',
      execute: (_, product) => ({
        component: UiProductNameCellComponent,
        inputs: { product, nameStyle: 'uppercase font-bold' },
      }),
    },
  };

  readonly #stock: TableColumnFormatting<LlecoopProduct, 'QUANTITY'> = {
    key: 'stock',
    title: 'Stock',
    pathToKey: 'stock',
    cssClasses: ['hidden @lg:flex @lg:min-w-[70px]'],
    formatting: {
      type: 'QUANTITY',
      extras: item => {
        const unitType = item?.unit?.type;
        const suffix = unitType === 'weight' ? 'kg' : 'u';
        const numberDigitsInfo = unitType === 'weight' ? '1.2-2' : '1.0-0';
        return {
          suffix,
          numberDigitsInfo,
        };
      },
    },
  };

  readonly #createdAt = createdAt<LlecoopProduct>();
  readonly #updatedAt = updatedAt<LlecoopProduct>();

  readonly #columnProperties: Signal<TableColumnFormatting<LlecoopProduct, FormattingTypes>[]> =
    signal([
      this.#image,
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
    ]);

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      sort: this.#store.sorting,
      pagination: this.#store.pagination,
      caption: 'Llistat de productes',
      getData: () => this.#store.entities(),
      count: this.#store.count,
      extraRowStyles: (product: LlecoopProduct) => {
        return !product.isAvailable ? 'marked-ko' : '';
      },
      actionsColStyles: 'max-w-[160px]',
      rowHeight: '140px',
      actions: {
        SET_AVAILABILITY: {
          visible: () => true,
          description: product =>
            `Fer que el producte "${product.name}" ${product.isAvailable ? 'no' : ''} estigui disponible`,
          order: 1,
          icon: (product: LlecoopProduct) => (!product.isAvailable ? 'cancelled' : 'check_circle'),
          execute: (product: LlecoopProduct) => {
            this.#store.update({ item: { ...product, isAvailable: !product.isAvailable } });
          },
        },
        EDIT: {
          visible: () => true,
          description: product => `Editar producte "${product.name}"`,
          order: 2,
        },
        DELETE: {
          visible: () => true,
          description: product => `Eliminar producte "${product.name}"`,
          order: 3,
        },
      },
    } as TableDefinition<LlecoopProduct>;
  }
}
