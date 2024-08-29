/* eslint-disable @typescript-eslint/member-ordering */
import { inject, Injectable } from '@angular/core';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import { LlecoopCategorySearchFeatureTableConfig } from '@plastik/llecoop/category/data-access';
import { ProductCategory } from '@plastik/llecoop/entities';
import { TableWithFilteringFacade } from '@plastik/shared/list-view';
import { TableSorting } from '@plastik/shared/table/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryListFacadeService implements TableWithFilteringFacade<ProductCategory> {
  private readonly store = inject(LlecoopCategoryStore);
  private readonly table = inject(LlecoopCategorySearchFeatureTableConfig);
  private readonly routeQueryParams$ = inject(Store).select(selectRouteQueryParams);
  private readonly router = inject(Router);

  tableStructure = this.table.getTableStructure();
  tableData = this.store.categories;
  count = this.store.count;
  viewName = 'categories';

  onChangeSorting(sorting: TableSorting): void {
    this.router.navigate([], {
      queryParams: {
        ...sorting,
      },
    });
  }
}
