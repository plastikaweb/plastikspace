import {
  BasePocketBaseEntity,
  BasePocketBaseEntityFilter,
  BasePocketBaseEntityPagination,
  IdType,
  SortConfig,
  SortMenuOptions,
} from '@plastik/core/entities';

export interface PocketBaseListParams {
  /**
   * Optional parameter object passed to the request usually used for filtering by entity property - value.
   */
  [key: string]: string | number | boolean | undefined;
  /**
   * Optional page number for pagination.
   */
  page?: number;
  /**
   * Optional number of items per page for pagination.
   */
  perPage?: number;
  /**
   * Optional sort field for ordering the list.
   */
  sort?: SortConfig['active'];
  /**
   * Optional sort direction for ordering the list.
   */
  direction?: SortConfig['direction'];
  /**
   * Optional text filter string for querying the list.
   */
  text?: string;
}

export interface PocketBaseGetListState {
  initiallyLoaded: boolean;
  listLoadingEnabled: boolean;
  count: number;
  sort: SortConfig;
  pagination: BasePocketBaseEntityPagination;
  filter: BasePocketBaseEntityFilter;
  text: string;
  paginationSizeOptions: number[];
  sortOptions: SortMenuOptions;
  apiRequestDebounceTime: number;
}

export const initialGetListState = (
  customInitialState: Partial<PocketBaseGetListState> = {}
): PocketBaseGetListState => ({
  initiallyLoaded: false,
  listLoadingEnabled: true,
  count: 0,
  sort: {
    active: 'updated',
    direction: 'desc',
  },
  pagination: {
    page: 1,
    perPage: 10,
  },
  filter: {},
  text: '',
  paginationSizeOptions: [10, 20, 50, 75],
  sortOptions: {
    updated: [
      { id: 1, direction: 'desc', icon: 'auto_awesome' },
      { id: 2, direction: 'asc', icon: 'history' },
    ],
  },
  apiRequestDebounceTime: 0,
  ...customInitialState,
});

export interface PocketbaseGetOne<T extends BasePocketBaseEntity> {
  selectedItemId: IdType<T> | null;
}
