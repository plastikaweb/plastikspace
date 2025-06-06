import { map, Observable, of, tap } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { categoryMainInitState, llecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

export const categoryFeatureListResolver: ResolveFn<Observable<boolean>> = (
  route
): Observable<boolean> => {
  const categoryStore = inject(llecoopCategoryStore);
  const { text } = categoryMainInitState.filter;
  const [active, direction] = categoryMainInitState.sorting as TableSortingConfig;
  const { pageIndex, pageSize } = categoryMainInitState.pagination;

  const queryParams = route.queryParams;

  return of(queryParams).pipe(
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
