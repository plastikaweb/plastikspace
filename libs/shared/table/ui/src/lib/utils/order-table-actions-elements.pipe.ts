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
  transform(list: TableControlActionAsCollection<T>[]): TableControlActionAsCollection<T>[] {
    if (!list) {
      throw new Error('An Array List is required to use OrderArrayElementsPipe');
    }

    // Fast path: 0 or 1 item needs no sorting or array cloning.
    if (list.length <= 1) {
      return list;
    }

    // Shallow copy before sorting to avoid mutating input array in-place.
    return [...list].sort((a, b) => (a.value.order || 0) - (b.value.order || 0));
  }
}
