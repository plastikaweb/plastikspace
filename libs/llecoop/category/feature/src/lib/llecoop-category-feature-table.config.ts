import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProductCategory } from '@plastik/llecoop/entities';
import { FormattingTypes } from '@plastik/shared/formatters';
import { DEFAULT_TABLE_CONFIG, TableColumnFormatting, TableControlStructure, TableStructureConfig } from '@plastik/shared/table/entities';

@Injectable()
export class ProductCategorySearchFeatureTableConfig implements TableStructureConfig<ProductCategory> {
  private readonly sanitizer = inject(DomSanitizer);

  private readonly name: TableColumnFormatting<ProductCategory, 'CUSTOM'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    formatting: {
      type: 'CUSTOM',
      execute: (value, element) => {
        const htmlString = `<p class="flex gap-sub justify-center items-center"><span class="w-sm h-sm rounded-full" style="background-color:${element?.color}"></span><span class="capitalize">${value}</span></p>`;
        return this.sanitizer.bypassSecurityTrustHtml(htmlString) as SafeHtml;
      },
    },
  };

  private readonly description: TableColumnFormatting<ProductCategory, 'TEXT'> = {
    key: 'description',
    title: 'Descripció',
    propertyPath: 'description',
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly columnProperties: TableColumnFormatting<ProductCategory, FormattingTypes>[] = [this.name, this.description];

  getTableStructure(): WritableSignal<TableControlStructure<ProductCategory>> {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return signal({
      ...defaultTableConfig,
      columnProperties: this.columnProperties,
      paginationVisibility: {
        hidePageSize: true,
        hideRangeLabel: true,
        hideRangeButtons: true,
        hidePaginationFirstLastButtons: true,
      },
      caption: 'Product Categories Table Results',
    });
  }
}
