import { inject } from '@angular/core';
import { signalStore, withMethods, withProps } from '@ngrx/signals';
import {
  initialGetListState,
  PocketBaseGetListState,
  withPocketBaseCrud,
} from '@plastik/signal-state/pocketbase';

import { Router } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { BasePocketBaseEntityFilter } from '@plastik/core/entities';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreOrder } from '@plastik/eco-store/entities';
import { activityStore } from '@plastik/shared/activity/data-access';
import { EcoStoreOrdersApiService } from './eco-store-orders-api.service';

export interface OrdersPocketBaseFilter extends BasePocketBaseEntityFilter {
  status: string | null;
  items: string | null;
}

export interface OrdersPocketBaseCrudState extends PocketBaseGetListState {
  filter: OrdersPocketBaseFilter;
}

export const ecoStoreOrdersStore = signalStore(
  withProps(() => ({
    _cartStore: inject(ecoStoreCartStore),
    _router: inject(Router),
    _activityStore: inject(activityStore),
    _profileStore: inject(pocketBaseUserProfileStore),
  })),

  withPocketBaseCrud<EcoStoreOrder, EcoStoreOrdersApiService>({
    featureName: 'orders',
    dataServiceType: EcoStoreOrdersApiService,
    autoLoad: () => inject(pocketBaseUserProfileStore).isAuthenticated,
    customInitialState: {
      paginationSizeOptions: [10, 20, 40],
      pagination: {
        page: 1,
        perPage: 10,
      },
      filter: {
        status: null,
        items: null,
      } as OrdersPocketBaseFilter,
      sortOptions: {
        ...initialGetListState().sortOptions,
        status: [
          { id: 3, direction: 'desc', icon: 'arrow_downward' },
          { id: 3, direction: 'asc', icon: 'arrow_upward' },
        ],
      },
      apiRequestDebounceTime: 0,
      isLoading: false,
      loaded: false,
    },
  }),

  withMethods(store => {
    return {
      async createOrder() {
        store._activityStore.setActivity(true, 'cart.finish.creatingOrder');
        try {
          const data = store._cartStore.toOrder();
          const newOrder = await store.create(data, {}, { success: false, error: true });

          if (newOrder) {
            store._cartStore.reset();
            await store._router.navigate(['/comandes', 'nova', newOrder.id]);
          }
        } finally {
          store._activityStore.setActivity(false);
        }
      },
    };
  })
);
