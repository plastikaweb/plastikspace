import { inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopBaseProduct } from '@plastik/llecoop/entities';
import { TableColumnFormatting } from '@plastik/shared/table/entities';

/**
 * @description Creates a table column formatting configuration for product categories.
 * @template T - The type of the product extending LlecoopProduct.
 * @param {Partial<TableColumnFormatting<T, 'CUSTOM'>>} [partialFormat] - Partial formatting options to override the defaults.
 * @returns {TableColumnFormatting<T, 'CUSTOM'>} The table column formatting configuration.
 */
export function productCategoryColumn<T extends LlecoopBaseProduct>(
  partialFormat: Partial<TableColumnFormatting<T, 'CUSTOM'>> = {}
): TableColumnFormatting<T, 'CUSTOM'> {
  const sanitizer = inject(DomSanitizer);

  return {
    key: 'categoryName',
    title: 'Categoria',
    propertyPath: 'category.name',
    cssClasses: ['hidden @xl:flex @xl:min-w-[150px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, element) => {
        if (value) {
          const htmlString = element?.category?.color
            ? `
              <p class="grid grid-cols-[15px_1fr] items-center justify-start gap-tiny">
                <span class="rounded-full size-sub"
                  style="background-color:${element?.category?.color}"></span>
                <span class="capitalize overflow-hidden">${value}</span>
              </p>`
            : `<div class="capitalize overflow-hidden">${value}</div>`;
          return sanitizer.bypassSecurityTrustHtml(htmlString) as SafeHtml;
        }
        return '-';
      },
    },
    ...partialFormat,
  };
}
