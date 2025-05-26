import { map, Observable, of, tap } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {
  llecoopOrderListStore,
  orderListMainInitState,
} from '@plastik/llecoop/order-list/data-access';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export const orderListFeatureListResolver: ResolveFn<Observable<boolean>> = (
  route
): Observable<boolean> => {
  const orderListStore = inject(llecoopOrderListStore);

  // Obtener los query params directamente del route activado
  const queryParams = route.queryParams;
  const { text, status } = orderListMainInitState.filter;
  const { pageIndex, pageSize } = orderListMainInitState.pagination;
  const [active, direction] = orderListMainInitState.sorting;

  orderListStore.setSelectedItemId(null);
  orderListStore.setSelectedItemUserOrderId(null);
  orderListStore.setSelectedItemCartLoaded(false);

  return of(queryParams).pipe(
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
