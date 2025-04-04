import { map, Observable, tap } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import { initState, llecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export const categoryFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const categoryStore = inject(llecoopCategoryStore);
  const store = inject(Store);

  const queryParams = store.select(selectRouteQueryParams);
  const { text } = initState.filter;
  const [active, direction] = initState.sorting as TableSortingConfig;
  const { pageIndex, pageSize } = initState.pagination;

  return queryParams.pipe(
    map(params => ({
      filter: {
        text: params['text'] || text,
      },
      sorting: [params['active'] || active, params['direction'] || direction] as TableSortingConfig,
      pagination: {
        pageIndex: Number(params['pageIndex'] || pageIndex),
        pageSize: Number(params['pageSize'] || pageSize),
      } as PageEventConfig,
    })),
    tap(({ filter, sorting, pagination }) => {
      categoryStore.resetTableConfig(pagination, filter, sorting);
    }),
    map(() => true)
  );
};
