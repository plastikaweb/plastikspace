import { Pipe, PipeTransform } from '@angular/core';

import { FormattingInput, PropertyFormatting } from './formatting';
import { DataFormatFactoryService } from './services';

/**
 * @description Format the value of the table cell from the configuration given.
 * @param { unknown } row The the single object where resides the property that needs to be formatted.
 * @param { PropertyFormatting } column The configuration for the object property.
 * @param { number } index The index number in the list.
 */
@Pipe({
  name: 'safeFormatted',
})
export class SafeFormattedPipe<T extends FormattingInput<keyof T>> implements PipeTransform {
  constructor(private readonly dataFormatService: DataFormatFactoryService<T>) {}

  transform(row: T, column: PropertyFormatting<T, unknown>, index?: number) {
    return this.dataFormatService.getFormattedValue(row, column, index);
  }
}
