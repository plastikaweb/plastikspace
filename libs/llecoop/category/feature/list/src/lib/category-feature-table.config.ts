import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { createdAt, updatedAt } from '@plastik/llecoop/util';
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
    sticky: true,
    cssClasses: ['min-w-[240px]'],
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
    cssClasses: ['hidden lg:flex lg:min-w-[210px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly createdAt = createdAt<LlecoopProductCategory>();
  private readonly updatedAt = updatedAt<LlecoopProductCategory>();

  private readonly columnProperties: TableColumnFormatting<
    LlecoopProductCategory,
    FormattingTypes
  >[] = [this.name, this.description, this.createdAt, this.updatedAt];

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
      caption: 'Llistat de categories',
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
    });
  }
}
