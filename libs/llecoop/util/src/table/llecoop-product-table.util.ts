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
    cssClasses: ['hidden md:flex md:min-w-[210px] justify-start'],
    formatting: {
      type: 'CUSTOM',
      execute: (value, element) => {
        if (value) {
          const htmlString = element?.category?.color
            ? `
                              <p class="flex items-center gap-tiny justify-start">
                                <span class="rounded-full w-sub h-sub p-sub"
                                  style="background-color:${element?.category?.color}"></span>
                                <span class="capitalize">${value}</span>
                              </p>`
            : `<p class="capitalize">${value}</p>`;
          return sanitizer.bypassSecurityTrustHtml(htmlString) as SafeHtml;
        }
        return '-';
      },
    },
    ...partialFormat,
  };
}
