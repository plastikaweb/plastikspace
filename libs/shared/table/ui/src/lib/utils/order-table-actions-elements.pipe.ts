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
   * @description Sorts table control action elements by their defined order property without mutating the input array.
   * Creates a shallow copy using `[...list]` before sorting to maintain pure functional pipe transformation semantics.
   * @param {TableControlActionAsCollection<T>[]} list - The array of action collection items to sort.
   * @returns {TableControlActionAsCollection<T>[]} A new sorted array of action elements.
   */
  transform(list: TableControlActionAsCollection<T>[]): TableControlActionAsCollection<T>[] {
    if (!list) {
      throw new Error('An Array List is required to use OrderArrayElementsPipe');
    }

    // Performance optimization: Shallow copy input array to avoid mutating the source array in place during template change detection.
    return [...list].sort((a, b) => (a.value.order || 0) - (b.value.order || 0));
  }
}
