import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
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
  readonly #sanitizer = inject(DomSanitizer);
  readonly #store = inject(LlecoopCategoryStore);

  readonly #name: TableColumnFormatting<LlecoopProductCategory, 'LINK'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    sticky: true,
    link: category => `./${category?.id}`,
    formatting: {
      type: 'LINK',
      execute: (value, element) => {
        const htmlString = `
        <p class="grid grid-cols-[15px_1fr] items-center justify-center gap-tiny">
          <span class="rounded-full size-sub" style="background-color:${element?.color}"></span>
          <span class="uppercase font-bold">${value}</span>
        </p>
        `;
        return this.#sanitizer.bypassSecurityTrustHtml(htmlString) as SafeHtml;
      },
    },
  };

  readonly #description: TableColumnFormatting<LlecoopProductCategory, 'TEXT'> = {
    key: 'description',
    title: 'Descripció',
    propertyPath: 'description',
    cssClasses: ['hidden @xl:flex @xl:min-w-[150px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #productCount: TableColumnFormatting<LlecoopProductCategory, 'TEXT'> = {
    key: 'productCount',
    title: 'Nre. de productes',
    propertyPath: 'productCount',
    sorting: true,
    cssClasses: ['max-w-[100px] @xl:max-w-none'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #createdAt = createdAt<LlecoopProductCategory>();
  readonly #updatedAt = updatedAt<LlecoopProductCategory>();

  readonly #columnProperties: TableColumnFormatting<LlecoopProductCategory, FormattingTypes>[] = [
    this.#name,
    this.#description,
    this.#productCount,
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
      caption: 'Llistat de categories',
      sort: this.#store.sorting,
      count: this.#store.count,
      getData: () => this.#store.entities(),
      actionsColStyles: 'max-w-[135px]',
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
