import { map, Observable, of, tap } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {
  initState,
  llecoopUserOrderProductStore,
} from '@plastik/llecoop/user-order-product-list/data-access';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export const llecoopUserOrderProductListFeatureResolver: ResolveFn<Observable<boolean>> = (
  route
): Observable<boolean> => {
  const userOrderProductStore = inject(llecoopUserOrderProductStore);

  const { text, category } = initState.filter;
  const [active, direction] = initState.sorting as TableSortingConfig;
  const { pageIndex, pageSize } = initState.pagination;

  const queryParams = route.queryParams;

  return of(queryParams).pipe(
    map(params => ({
      filter: {
        text: params['text'] || text,
        category: params['category'] || category,
      },
      sorting: [params['active'] || active, params['direction'] || direction] as TableSortingConfig,
      pagination: {
        pageIndex: Number(params['pageIndex'] || pageIndex),
        pageSize: Number(params['pageSize'] || pageSize),
      } as PageEventConfig,
    })),
    tap(({ filter, sorting, pagination }) => {
      userOrderProductStore.resetTableConfig(pagination, filter, sorting);
    }),
    map(() => true)
  );
};
