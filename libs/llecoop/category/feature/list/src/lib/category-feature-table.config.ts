import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { FormattingTypes } from '@plastik/shared/formatters';
import {
  DEFAULT_TABLE_CONFIG,
  TableColumnFormatting,
  TableControlStructure,
  TableStructureConfig,
} from '@plastik/shared/table/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategorySearchFeatureTableConfig
  implements TableStructureConfig<LlecoopProductCategory>
{
  private readonly sanitizer = inject(DomSanitizer);

  private readonly name: TableColumnFormatting<LlecoopProductCategory, 'CUSTOM'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    formatting: {
      type: 'CUSTOM',
      execute: (value, element) => {
        const htmlString = `<p class="flex items-center justify-center gap-sub"><span class="rounded-full w-sm h-sm" style="background-color:${element?.color}"></span><span class="capitalize">${value}</span></p>`;
        return this.sanitizer.bypassSecurityTrustHtml(htmlString) as SafeHtml;
      },
    },
  };

  private readonly description: TableColumnFormatting<LlecoopProductCategory, 'TEXT'> = {
    key: 'description',
    title: 'Descripció',
    propertyPath: 'description',
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly columnProperties: TableColumnFormatting<
    LlecoopProductCategory,
    FormattingTypes
  >[] = [this.name, this.description];

  getTableStructure(): WritableSignal<TableControlStructure<LlecoopProductCategory>> {
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
