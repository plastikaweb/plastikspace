import { signalStore } from '@ngrx/signals';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import {
    initStoreFirebaseCrudState, StoreFirebaseCrudFilter, StoreFirebaseCrudState, withFirebaseCrud
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopProductFireService } from './product-fire.service';

export type StoreProductFilter = StoreFirebaseCrudFilter & {
  text: string;
  category: 'all' | string;
  inStock: 'all' | true | false;
};

export const initState: StoreFirebaseCrudState<LlecoopProduct, StoreProductFilter> = {
  ...initStoreFirebaseCrudState(),
  filter: {
    text: '',
    category: 'all',
    inStock: 'all',
  },
  pagination: {
    pageSize: 10,
    pageIndex: 0,
    pageLastElements: new Map<number, LlecoopProduct>(),
  },
  sorting: ['updatedAt', 'desc'] as TableSortingConfig,
  baseRoute: 'admin/producte',
};

export const llecoopProductStore = signalStore(
  { providedIn: 'root' },
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
