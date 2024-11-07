import { EntityId } from '@ngrx/signals/entities';
import { TableSortingConfig } from '@plastik/shared/table/entities';

export interface LlecoopFeatureStore {
  loaded: boolean;
  lastUpdated: Date;
  sorting: TableSortingConfig;
  selectedItemId: EntityId | null;
}
