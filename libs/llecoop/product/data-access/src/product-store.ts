import { signalStore, withState } from '@ngrx/signals';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { TableSortingConfig } from '@plastik/shared/table/entities';
import {
  FirebaseCrudFilter,
  FirebaseCrudState,
  initStoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/signal-state/firebase';

import { LlecoopProductFireService } from './product-fire.service';

export type StoreProductFilter = FirebaseCrudFilter & {
  text: string;
  category: string;
  isAvailable: 'all' | 'on' | 'off';
};

export type ProductStoreCrudState = FirebaseCrudState<LlecoopProduct, StoreProductFilter>;

export const initState: FirebaseCrudState<LlecoopProduct, StoreProductFilter> = {
  ...initStoreFirebaseCrudState(),
  filter: {
    text: '',
    category: '',
    isAvailable: 'all',
  },
  pagination: {
    pageSize: 10,
    pageIndex: 0,
    pageLastElements: new Map<number, LlecoopProduct>(),
  },
  sorting: ['updatedAt', 'desc'] as TableSortingConfig,
  baseRoute: 'productes',
};

export const llecoopProductStore = signalStore(
  { providedIn: 'root' },
  withState<ProductStoreCrudState>(initState),
  withFirebaseCrud<
    LlecoopProduct,
    LlecoopProductFireService,
    StoreProductFilter,
    FirebaseCrudState<LlecoopProduct, StoreProductFilter>
  >({
    featureName: 'product',
    dataServiceType: LlecoopProductFireService,
    initState,
  })
);
