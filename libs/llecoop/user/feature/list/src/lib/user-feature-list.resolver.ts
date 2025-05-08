import { map, Observable, tap } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import { llecoopUserStore, userMainInitState } from '@plastik/llecoop/user/data-access';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export const userFeatureListResolver: ResolveFn<Observable<boolean>> = (): Observable<boolean> => {
  const userStore = inject(llecoopUserStore);
  const store = inject(Store);

  const queryParams = store.select(selectRouteQueryParams);
  const { name, email, role } = userMainInitState.filter;
  const [active, direction] = userMainInitState.sorting as TableSortingConfig;
  const { pageIndex, pageSize } = userMainInitState.pagination;

  return queryParams.pipe(
    map(params => ({
      filter: {
        name: params['name'] || name,
        email: params['email'] || email,
        role: params['role'] || role,
      },
      sorting: [params['active'] || active, params['direction'] || direction] as TableSortingConfig,
      pagination: {
        pageIndex: Number(params['pageIndex'] || pageIndex),
        pageSize: Number(params['pageSize'] || pageSize),
      } as PageEventConfig,
    })),
    tap(({ filter, sorting, pagination }) => {
      userStore.resetTableConfig(pagination, filter, sorting);
    }),
    map(() => true)
  );
};
