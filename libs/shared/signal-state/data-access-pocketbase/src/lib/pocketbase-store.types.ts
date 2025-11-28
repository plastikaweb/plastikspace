import {
  BasePocketBaseEntitySort,
  BasePocketBaseEntityPagination,
  BasePocketBaseEntityFilter,
} from '@plastik/eco-store/entities';

export interface PocketBaseListParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  perPage?: number;
  sort?: string;
  filter?: string;
}

export interface PocketBaseGetListState {
  initiallyLoaded: boolean;
  count: number;
  sort: BasePocketBaseEntitySort;
  pagination: BasePocketBaseEntityPagination;
  filter: BasePocketBaseEntityFilter;
}

export const initialGetListState = (): PocketBaseGetListState => ({
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
});
