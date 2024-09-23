import { Pipe, PipeTransform } from '@angular/core';
import { TableControlActionDefinition } from '@plastik/shared/table/entities';

type TableControlActionAsCollection<T> = {
  key: Uppercase<string>;
  value: TableControlActionDefinition<T>;
};

@Pipe({
  name: 'orderTableActionsElements',
  standalone: true,
})
export class OrderTableActionsElementsPipe<T> implements PipeTransform {
  transform(list: TableControlActionAsCollection<T>[]): TableControlActionAsCollection<T>[] {
    if (!list) {
      throw new Error('An Array List is required to use OrderArrayElementsPipe');
    }

    return list.sort((a, b) => (a.value.order || 0) - (b.value.order || 0));
  }
}
