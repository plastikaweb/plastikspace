import { Pipe, PipeTransform } from '@angular/core';
import { latinize } from '@plastik/shared/latinize';

export interface FilterArrayPipeConfig<T> {
  fields: (keyof T)[];
  value: string;
}

@Pipe({
  name: 'filterArray',
  standalone: true,
})
/**
 * Custom pipe that filters an array based on specified filters.
 * @template T - The type of the array elements.
 */
export class FilterArrayPipe implements PipeTransform {
  /**
   * @description Transforms an array by applying multiple filters.
   * @template T - The type of elements in the array.
   * @param { T[] } arr - The array to be filtered.
   * @param { FilterArrayPipeConfig<T>[] } filters An array of filter configurations.
   * @returns { T[] } The filtered array.
   */
  transform<T>(arr: T[] = [], filters: FilterArrayPipeConfig<T>[]): T[] {
    return arr.filter(item => {
      return filters.every(filter => {
        return filter.fields.some((field: keyof T) => {
          const latinizedValue = latinize(`${item[field]}`).toLowerCase();
          const latinizedFilter = latinize(`${filter.value}`).toLowerCase();

          return latinizedValue.includes(latinizedFilter);
        });
      });
    });
  }
}
