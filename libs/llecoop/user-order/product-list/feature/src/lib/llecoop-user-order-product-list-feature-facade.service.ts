/* eslint-disable no-console */
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EntityId } from '@ngrx/signals/entities';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import {
  llecoopUserOrderProductStore,
  StoreUserOrderProductProductFilter,
} from '@plastik/llecoop/user-order-product-list/data-access';
import { PageEventConfig } from '@plastik/shared/table/entities';

import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';
import { LlecoopUserOrderProductListFeatureSearchFormConfig } from './llecoop-user-order-product-list-feature-search-form.config';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderProductListFeatureFacadeService {
  readonly #orderProductStore = inject(llecoopUserOrderProductStore);
  readonly #cartStore = inject(llecoopUserOrderCartStore);
  readonly #router = inject(Router);

  readonly products = this.#orderProductStore.entities;
  readonly cart = this.#cartStore.cart;
  readonly count = this.#orderProductStore.count;
  readonly pagination = this.#orderProductStore.pagination;
  readonly pageSizeOptions = signal([10, 25, 50]);

  filterFormConfig = inject(LlecoopUserOrderProductListFeatureSearchFormConfig).getConfig();
  filterCriteria = this.#orderProductStore.filter;

  addToCart(product: LlecoopProductWithQuantity) {
    this.#cartStore.addItem(product);
  }

  viewDetails(productId: EntityId) {
    console.log(productId);
  }

  onChangeFilterCriteria(criteria: StoreUserOrderProductProductFilter): void {
    this.#router.navigate([], {
      queryParams: { ...criteria, pageIndex: 0 },
      queryParamsHandling: 'merge',
    });
  }

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
