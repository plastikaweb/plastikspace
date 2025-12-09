import {
  BasePocketBaseEntity,
  BasePocketBaseEntityFilter,
  BasePocketBaseEntityPagination,
  BasePocketBaseEntitySort,
  IdType,
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
  sort?: BasePocketBaseEntitySort['sort'];
  /**
   * Optional sort direction for ordering the list.
   */
  direction?: BasePocketBaseEntitySort['direction'];
  /**
   * Optional text filter string for querying the list.
   */
  text?: string;
}

export interface PocketBaseGetListState {
  initiallyLoaded: boolean;
  count: number;
  sort: BasePocketBaseEntitySort;
  pagination: BasePocketBaseEntityPagination;
  filter: BasePocketBaseEntityFilter;
  text: string;
  paginationSizeOptions: number[];
}

export const initialGetListState = (
  customInitialState: Partial<PocketBaseGetListState> = {}
): PocketBaseGetListState => ({
  initiallyLoaded: false,
  count: 0,
  sort: {
    sort: 'updated',
    direction: 'desc',
  },
  pagination: {
    page: 1,
    perPage: 10,
  },
  filter: {},
  text: '',
  paginationSizeOptions: [10, 20, 50, 75],
  ...customInitialState,
});

export interface PocketbaseGetOne<T extends BasePocketBaseEntity> {
  selectedItemId: IdType<T> | null;
}
