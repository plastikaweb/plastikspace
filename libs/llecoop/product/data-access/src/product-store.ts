import { signalStore, withState } from '@ngrx/signals';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import {
  initStoreFirebaseCrudState,
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopProductFireService } from './product-fire.service';

export type StoreProductFilter = StoreFirebaseCrudFilter & {
  text: string;
  category: string;
  isAvailable: 'all' | 'on' | 'off';
};

export type ProductStoreCrudState = StoreFirebaseCrudState<LlecoopProduct, StoreProductFilter>;

export const initState: StoreFirebaseCrudState<LlecoopProduct, StoreProductFilter> = {
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
    StoreFirebaseCrudState<LlecoopProduct, StoreProductFilter>
  >({
    featureName: 'product',
    dataServiceType: LlecoopProductFireService,
    initState,
  })
);
