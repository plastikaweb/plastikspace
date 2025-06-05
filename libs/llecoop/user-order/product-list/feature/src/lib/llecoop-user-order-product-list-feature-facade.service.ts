/* eslint-disable no-console */
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EntityId } from '@ngrx/signals/entities';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderProductStore } from '@plastik/llecoop/user-order-product-list/data-access';
import { PageEventConfig } from '@plastik/shared/table/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderProductListFeatureFacadeService {
  readonly #store = inject(llecoopUserOrderProductStore);
  readonly #router = inject(Router);

  readonly products = this.#store.entities;
  readonly count = this.#store.count;
  readonly pagination = this.#store.pagination;
  readonly pageSizeOptions = signal([10, 25, 50]);

  // filterFormConfig = getLlecoopOrderListFeatureListSearchFormConfig();
  filterCriteria = this.#store.filter;

  addToCart({ product, quantity }: { product: LlecoopProduct; quantity: number }) {
    console.log(product, quantity);
  }

  viewDetails(productId: EntityId) {
    console.log(productId);
  }

  // onChangeFilterCriteria(criteria: StoreUserOrderProductProductFilter): void {
  // this.#router.navigate([], {
  //   queryParams: { ...criteria, pageIndex: 0 },
  //   queryParamsHandling: 'merge',
  // });
  //}

  onTablePagination({ pageIndex, pageSize }: PageEventConfig): void {
    if (pageSize !== this.pagination()?.pageSize) {
      pageIndex = 0;
    }
    this.#router.navigate([], {
      queryParams: { pageIndex, pageSize },
      queryParamsHandling: 'merge',
    });
  }
}
