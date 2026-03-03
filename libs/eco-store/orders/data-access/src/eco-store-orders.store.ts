import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { initialGetListState, withPocketBaseCrud } from '@plastik/signal-state/pocketbase';

import { Router } from '@angular/router';
import { DataCrud } from '@plastik/core/api-base';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreOrder } from '@plastik/eco-store/entities';
import { ListResult } from 'pocketbase';
import { EcoStoreOrdersApiService } from './eco-store-orders-api.service';
export type OrdersPocketBaseCrudState = DataCrud<EcoStoreOrder, ListResult<EcoStoreOrder>>;

export const ecoStoreOrdersStore = signalStore(
  { providedIn: 'root' },
  withPocketBaseCrud<EcoStoreOrder, OrdersPocketBaseCrudState>({
    featureName: 'orders',
    dataServiceType: EcoStoreOrdersApiService,
    customInitialState: {
      paginationSizeOptions: [20, 50, 75],
      pagination: {
        page: 1,
        perPage: 20,
      },
      sortOptions: {
        ...initialGetListState().sortOptions,
      },
      apiRequestDebounceTime: 0,
    },
  }),

  withMethods(store => {
    const cartStore = inject(ecoStoreCartStore);
    const router = inject(Router);

    return {
      async createOrder() {
        const data = cartStore.toOrder();
        const newOrder = await store.create(data);
        cartStore.resetCartAfterCheckout();
        await router.navigate(['/comanda', newOrder.id]);
      },
    };
  })
);
