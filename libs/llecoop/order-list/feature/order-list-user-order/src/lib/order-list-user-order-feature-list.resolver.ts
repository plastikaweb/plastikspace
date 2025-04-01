import { map, Observable, tap } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import {
  llecoopUserOrderStore,
  userOrderMainInitState,
} from '@plastik/llecoop/order-list/data-access';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export const orderListUserOrderFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const userOrderStore = inject(llecoopUserOrderStore);
  const store = inject(Store);

  userOrderStore.setSelectedItemId(null);

  const queryParams = store.select(selectRouteQueryParams);
  const { text, userNormalizedName, status } = userOrderMainInitState.filter;
  const [active, direction] = userOrderMainInitState.sorting as TableSortingConfig;
  const { pageIndex, pageSize } = userOrderMainInitState.pagination;

  return queryParams.pipe(
    map(params => ({
      filter: {
        text: params['text'] || text,
        userNormalizedName: params['userNormalizedName'] || userNormalizedName,
        status: params['status'] || status,
      },
      sorting: [params['active'] || active, params['direction'] || direction] as TableSortingConfig,
      pagination: {
        pageIndex: Number(params['pageIndex'] || pageIndex),
        pageSize: Number(params['pageSize'] || pageSize),
      } as PageEventConfig,
    })),
    tap(({ filter, sorting, pagination }) => {
      userOrderStore.resetTableConfig(pagination, filter, sorting);
    }),
    map(() => true)
  );
};
