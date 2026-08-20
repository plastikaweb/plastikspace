import { Pipe, PipeTransform } from '@angular/core';
import { TableControlActionDefinition } from '@plastik/shared/table/entities';

type TableControlActionAsCollection<T> = {
  key: Uppercase<string>;
  value: TableControlActionDefinition<T>;
};

@Pipe({
  name: 'orderTableActionsElements',
})
export class OrderTableActionsElementsPipe<T> implements PipeTransform {
  /**
   * @description Sorts table control actions based on their `order` property.
   * @param {TableControlActionAsCollection<T>[]} list The actions array to sort.
   * @returns {TableControlActionAsCollection<T>[]} Sorted actions array.
   */
  transform(list: TableControlActionAsCollection<T>[]): TableControlActionAsCollection<T>[] {
    if (!list) {
      throw new Error('An Array List is required to use OrderArrayElementsPipe');
    }

    // Fast-path: 0 or 1 element arrays require no sorting work.
    if (list.length <= 1) {
      return list;
    }

    // Return a shallow copy sorted by order to avoid mutating the input array in place.
    return [...list].sort((a, b) => (a.value.order || 0) - (b.value.order || 0));
  }
}
