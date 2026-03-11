import { inject } from '@angular/core';
import { signalStore, withMethods, withProps } from '@ngrx/signals';
import { initialGetListState, withPocketBaseCrud } from '@plastik/signal-state/pocketbase';

import { Router } from '@angular/router';
import { DataCrud } from '@plastik/core/api-base';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreOrder } from '@plastik/eco-store/entities';
import { activityStore } from '@plastik/shared/activity/data-access';
import { ListResult } from 'pocketbase';
import { EcoStoreOrdersApiService } from './eco-store-orders-api.service';

export type OrdersPocketBaseCrudState = DataCrud<EcoStoreOrder, ListResult<EcoStoreOrder>>;

export const ecoStoreOrdersStore = signalStore(
  { providedIn: 'root' },
  withPocketBaseCrud<EcoStoreOrder, OrdersPocketBaseCrudState>({
    featureName: 'orders',
    dataServiceType: EcoStoreOrdersApiService,
    customInitialState: {
      paginationSizeOptions: [10, 20, 40],
      pagination: {
        page: 1,
        perPage: 10,
      },
      sort: {
        active: 'created',
        direction: 'desc',
      },
      sortOptions: {
        ...initialGetListState().sortOptions,
      },
      apiRequestDebounceTime: 0,
      isLoading: false,
    },
  }),
  withProps(() => ({
    _cartStore: inject(ecoStoreCartStore),
    _router: inject(Router),
    _activityStore: inject(activityStore),
  })),

  withMethods(store => {
    return {
      async createOrder() {
        store._activityStore.setActivity(true, 'cart.finish.creatingOrder');
        const data = store._cartStore.toOrder();
        const newOrder = await store.create(data, {}, { success: false, error: true });
        store._cartStore.resetCartAfterCheckout();
        await store._router.navigate(['/comandes', 'nova', newOrder?.id]);
        store._activityStore.setActivity(false);
      },
    };
  })
);
