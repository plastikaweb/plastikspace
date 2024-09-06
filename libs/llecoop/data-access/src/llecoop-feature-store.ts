import { FilterArrayPipeConfig } from '@plastik/shared/filter-array-pipe';
import { TableSorting } from '@plastik/shared/table/entities';

export interface LlecoopFeatureStore<T> {
  loaded: boolean;
  lastUpdated: Date;
  sorting: TableSorting;
  filter: FilterArrayPipeConfig<T>[];
}
