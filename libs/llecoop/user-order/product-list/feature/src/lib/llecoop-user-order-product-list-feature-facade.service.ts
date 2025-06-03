/* eslint-disable no-console */
import { inject, Injectable } from '@angular/core';
import { EntityId } from '@ngrx/signals/entities';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderProductStore } from '@plastik/llecoop/user-order-product-list/data-access';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderProductListFeatureFacadeService {
  readonly #store = inject(llecoopUserOrderProductStore);
  readonly products = this.#store.entities;

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

  // onTablePagination({ pageIndex, pageSize }: PageEventConfig): void {
  // this.#router.navigate([], {
  //   queryParams: { pageIndex, pageSize },
  //   queryParamsHandling: 'merge',
  // });
  //}
}
