import { signalStore } from '@ngrx/signals';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import {
  StoreFirebaseCrudFilter,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopProductFireService } from './product-fire.service';

export type StoreProductFilter = StoreFirebaseCrudFilter & {
  text: string;
  category: 'all' | string;
  inStock: 'all' | true | false;
};

export const initProductStoreFilter: StoreProductFilter = {
  text: '',
  category: 'all',
  inStock: 'all',
};
export const initProductStoreSorting = ['updatedAt', 'desc'] as TableSortingConfig;
export const initProductStorePagination = {
  pageSize: 10,
  pageIndex: 0,
  pageLastElements: new Map<number, LlecoopProduct>(),
};

export const llecoopProductStore = signalStore(
  { providedIn: 'root' },
  withFirebaseCrud<LlecoopProduct, LlecoopProductFireService, StoreProductFilter>({
    featureName: 'product',
    dataServiceType: LlecoopProductFireService,
    initFilter: initProductStoreFilter,
    initSorting: initProductStoreSorting,
    initPagination: initProductStorePagination,
    baseRoute: 'admin/producte',
  })
);
