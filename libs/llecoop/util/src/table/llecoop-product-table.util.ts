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
    cssClasses: ['hidden md:flex md:min-w-[220px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, element) => {
        if (value) {
          const htmlString = element?.category?.color
            ? `
              <div class="flex items-center gap-sub justify-start">
                <span class="rounded-full size-sub p-sub"
                  style="background-color:${element?.category?.color}"></span>
                <span class="capitalize">${value}</span>
              </div>`
            : `<div class="capitalize">${value}</div>`;
          return sanitizer.bypassSecurityTrustHtml(htmlString) as SafeHtml;
        }
        return '-';
      },
    },
    ...partialFormat,
  };
}
