import { map, Observable, tap } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import {
  llecoopOrderListStore,
  orderListMainInitState,
} from '@plastik/llecoop/order-list/data-access';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export const orderListFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const orderListStore = inject(llecoopOrderListStore);
  const store = inject(Store);

  const queryParams = store.select(selectRouteQueryParams);
  const { text, status } = orderListMainInitState.filter;
  const { pageIndex, pageSize } = orderListMainInitState.pagination;
  const [active, direction] = orderListMainInitState.sorting;

  orderListStore.setSelectedItemId(null);
  orderListStore.setSelectedItemUserOrderId(null);
  orderListStore.setSelectedItemCartLoaded(false);

  return queryParams.pipe(
    map(params => ({
      filter: {
        text: params['text'] || text,
        status: params['status'] || status,
      },
      sorting: [params['active'] || active, params['direction'] || direction] as TableSortingConfig,
      pagination: {
        pageIndex: Number(params['pageIndex'] || pageIndex),
        pageSize: Number(params['pageSize'] || pageSize),
      } as PageEventConfig,
    })),
    tap(({ filter, sorting, pagination }) => {
      orderListStore.resetTableConfig(pagination, filter, sorting);
    }),
    map(() => true)
  );
};
