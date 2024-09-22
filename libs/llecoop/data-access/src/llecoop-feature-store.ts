import { TableSortingConfig } from '@plastik/shared/table/entities';

export interface LlecoopFeatureStore<T> {
  loaded: boolean;
  lastUpdated: Date;
  sorting: TableSortingConfig;
  selectedItem: T | null;
}
