import { inject, Pipe, PipeTransform } from '@angular/core';
import { BaseEntity } from '@plastik/core/entities';

import { PropertyFormatting } from './formatting';
import { DataFormatFactoryService } from './services';

/**
 * Format a value based on the given configuration.
 */
@Pipe({
  name: 'safeFormatted',
})
export class SafeFormattedPipe<T extends BaseEntity> implements PipeTransform {
  readonly #dataFormatService = inject<DataFormatFactoryService<T>>(DataFormatFactoryService);

  /**
   * Formats a value based on the configuration.
   * @param row - The single object where resides the property that needs to be formatted.
   * @param column - The configuration for the object property.
   * @param index - The index number in a list of values.
   * @param extraConfig - A custom configuration object to add extra formatting options.
   * @returns The formatted value.
   */
  transform(
    row: T extends BaseEntity ? T : never,
    column: PropertyFormatting<T, unknown>,
    index?: number,
    extraConfig?: unknown
  ) {
    return this.#dataFormatService.getFormattedValue(row, column, index, extraConfig);
  }
}
