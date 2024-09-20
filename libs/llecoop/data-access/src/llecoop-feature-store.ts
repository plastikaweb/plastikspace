import { TableSorting } from '@plastik/shared/table/entities';

export interface LlecoopFeatureStore<T> {
  loaded: boolean;
  lastUpdated: Date;
  sorting: TableSorting;
  selectedItem: T | null;
}
