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
   * Transforms a collection of table control actions sorted by their order property.
   * @param {TableControlActionAsCollection<T>[]} list The action collection to sort.
   * @returns {TableControlActionAsCollection<T>[]} A new sorted array of table control actions.
   */
  transform(list: TableControlActionAsCollection<T>[]): TableControlActionAsCollection<T>[] {
    if (!list) {
      throw new Error('An Array List is required to use OrderArrayElementsPipe');
    }

    // Performance optimization: Avoid array sorting overhead for collections with 0 or 1 items.
    if (list.length <= 1) {
      return [...list];
    }

    // Performance & Immutability optimization: Use non-mutating shallow copy before sorting
    // to prevent mutating the original input array in state or templates.
    return [...list].sort(
      (actionA, actionB) => (actionA.value.order || 0) - (actionB.value.order || 0)
    );
  }
}
