import { map, Observable, of, tap } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { initState, llecoopUserStore } from '@plastik/llecoop/user/data-access';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export const userFeatureListResolver: ResolveFn<Observable<boolean>> = (
  route
): Observable<boolean> => {
  const userStore = inject(llecoopUserStore);
  const { name, email, role } = initState.filter;
  const [active, direction] = initState.sorting as TableSortingConfig;
  const { pageIndex, pageSize } = initState.pagination;

  // Obtener los query params directamente del route activado
  const queryParams = route.queryParams;

  return of(queryParams).pipe(
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
