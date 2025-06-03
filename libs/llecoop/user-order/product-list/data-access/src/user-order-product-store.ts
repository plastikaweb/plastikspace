import { signalStore, withState } from '@ngrx/signals';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import {
  initStoreFirebaseCrudState,
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopUserOrderProductFireService } from './user-order-product-fire.service';

export type StoreUserOrderProductProductFilter = StoreFirebaseCrudFilter & {
  text: string;
  category: string;
};

export type UserOrderProductStoreFirebaseCrudState = StoreFirebaseCrudState<
  LlecoopProduct,
  StoreUserOrderProductProductFilter
>;

export const initState: StoreFirebaseCrudState<LlecoopProduct, StoreUserOrderProductProductFilter> =
  {
    ...initStoreFirebaseCrudState(),
    filter: {
      text: '',
      category: '',
    },
    pagination: {
      pageSize: 10,
      pageIndex: 0,
      pageLastElements: new Map<number, LlecoopProduct>(),
    },
    sorting: ['updatedAt', 'desc'] as TableSortingConfig,
    baseRoute: '/',
    _adminOnly: false,
    _public: true,
  };

export const llecoopUserOrderProductStore = signalStore(
  { providedIn: 'root' },
  withState<UserOrderProductStoreFirebaseCrudState>(initState),
  withFirebaseCrud<
    LlecoopProduct,
    LlecoopUserOrderProductFireService,
    StoreUserOrderProductProductFilter,
    UserOrderProductStoreFirebaseCrudState
  >({
    featureName: 'user-order-product',
    dataServiceType: LlecoopUserOrderProductFireService,
    initState,
  })
);
