import { map, Observable, of, tap } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {
  llecoopUserOrderStore,
  userOrderMainInitState,
} from '@plastik/llecoop/order-list/data-access';
import { llecoopUserStore } from '@plastik/llecoop/user/data-access';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export const userOrderFeatureListResolver: ResolveFn<Observable<boolean>> = (
  route
): Observable<boolean> => {
  const userOrderStore = inject(llecoopUserOrderStore);
  const userStore = inject(llecoopUserStore);

  // Obtener los query params directamente del route activado
  const queryParams = route.queryParams;
  const { text, status, userNormalizedName } = userOrderMainInitState.filter;
  const [active, direction] = userOrderMainInitState.sorting as TableSortingConfig;
  const { pageIndex, pageSize } = userOrderMainInitState.pagination;

  return of(queryParams).pipe(
    map(params => ({
      filter: {
        text: params['text'] || text,
        status: params['status'] || status,
        userNormalizedName,
        userId: (userStore.loggedUser()?.id as string) ?? null,
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
