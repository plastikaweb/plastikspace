import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
  LlecoopCategorySearchFeatureTableConfig,
  LlecoopCategoryStore,
} from '@plastik/llecoop/category/data-access';
import { TableSorting } from '@plastik/shared/table/entities';

export const LlecoopCategoryListResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot
): boolean => {
  const store = inject(LlecoopCategoryStore);
  const tableStructure = inject(LlecoopCategorySearchFeatureTableConfig).getTableStructure();

  const sort = tableStructure().sort;

  const params: TableSorting = {
    active: sort?.[0] || 'name',
    direction: sort?.[1] || 'asc',
    ...route.queryParams,
  };

  store.getAll(params);

  return true;
};
