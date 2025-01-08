import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopProduct } from '@plastik/llecoop/entities';
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
  readonly #sanitizer = inject(DomSanitizer);
  readonly #store = inject(LlecoopProductStore);

  readonly #name: TableColumnFormatting<LlecoopProduct, 'LINK'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    link: (product?: LlecoopProduct) => `./${product?.id}`,
    formatting: {
      type: 'LINK',
      execute: (_, product) => {
        const link = `<p class="font-bold uppercase">${product?.name}</p>`;
        const info = product?.info ? `<p class="font-bold">${product?.info}</p>` : '';
        const provider = product?.provider ? `<li>Proveïdor: ${product?.provider}</li>` : '';
        const origin = product?.origin ? `<li>Procedència: ${product?.origin}</li>` : '';
        const extra = `<ul class="hidden md:block">${provider}${origin}</ul>`;
        return this.#sanitizer.bypassSecurityTrustHtml(`${link}${info}${extra}`) as SafeHtml;
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
