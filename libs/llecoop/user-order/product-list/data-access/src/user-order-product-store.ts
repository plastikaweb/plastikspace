import { signalStore, withState } from '@ngrx/signals';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { TableSortingConfig } from '@plastik/shared/table/entities';
import {
  FirebaseCrudFilter,
  FirebaseCrudState,
  initStoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/signal-state/firebase';

import { LlecoopUserOrderProductFireService } from './user-order-product-fire.service';

export type StoreUserOrderProductProductFilter = FirebaseCrudFilter & {
  text: string;
  category: string;
};

export type UserOrderProductStoreCrudState = FirebaseCrudState<
  LlecoopProduct,
  StoreUserOrderProductProductFilter
>;

export const initState: FirebaseCrudState<LlecoopProduct, StoreUserOrderProductProductFilter> = {
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
  withState<UserOrderProductStoreCrudState>(initState),
  withFirebaseCrud<
    LlecoopProduct,
    LlecoopUserOrderProductFireService,
    StoreUserOrderProductProductFilter,
    FirebaseCrudState<LlecoopProduct, StoreUserOrderProductProductFilter>
  >({
    featureName: 'user-order-product',
    dataServiceType: LlecoopUserOrderProductFireService,
    initState,
  })
);
