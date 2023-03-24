import { Pipe, PipeTransform } from '@angular/core';

import { FormattingInput, PropertyFormatting } from './formatting';
import { DataFormatFactoryService } from './services';

/**
 * @description Format a value based on the given configuration.
 * @param { unknown } row The the single object where resides the property that needs to be formatted.
 * @param { PropertyFormatting } column The configuration for the object property.
 * @param { number } index The index number in a list of values.
 * @param { unknown } extraConfig A custom configuration object to add extra formatting options.
 */
@Pipe({
  name: 'safeFormatted',
})
export class SafeFormattedPipe<T extends FormattingInput<keyof T>> implements PipeTransform {
  constructor(private readonly dataFormatService: DataFormatFactoryService<T>) {}

  transform(row: T, column: PropertyFormatting<T, unknown>, index?: number, extraConfig?: unknown) {
    return this.dataFormatService.getFormattedValue(row, column, index, extraConfig);
  }
}
