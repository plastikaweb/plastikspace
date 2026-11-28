import { BasePocketBaseEntityPagination, SortConfig } from '@plastik/core/entities';
import { PageEventConfig, TableSortingConfig } from '@plastik/shared/table/entities';

/**
 * Converts a PocketBase store's pagination into a table's.
 * The store counts `page` from 1; `PageEventConfig`, which `plastik-shared-table` and
 * `mat-paginator` read, counts `pageIndex` from 0.
 * @param {BasePocketBaseEntityPagination} pagination The store's pagination.
 * @returns {PageEventConfig} The table's pagination; a page below 1 reads as the first page.
 */
export function toTablePagination({
  page,
  perPage,
}: BasePocketBaseEntityPagination): PageEventConfig {
  return {
    pageIndex: Math.max(page, 1) - 1,
    pageSize: perPage,
  };
}

/**
 * Converts a table or paginator page event into a PocketBase store's pagination.
 * The event counts `pageIndex` from 0, the store counts `page` from 1. A change of page size
 * returns to the first page, as `plastik-shared-table` does, because the old index points
 * into a different slicing.
 * @param {PageEventConfig} event The page event.
 * @param {number} [currentPageSize] The page size before the event; without it no reset applies.
 * @returns {BasePocketBaseEntityPagination} The store's pagination, `page` and `perPage` at least 1.
 */
export function fromTablePagination(
  { pageIndex, pageSize }: PageEventConfig,
  currentPageSize?: number
): BasePocketBaseEntityPagination {
  const isPageSizeChange = currentPageSize !== undefined && currentPageSize !== pageSize;

  return {
    page: isPageSizeChange ? 1 : Math.max(pageIndex + 1, 1),
    perPage: Math.max(pageSize, 1),
  };
}

/**
 * Converts a store's sort object into a table's sort tuple.
 * `plastik-shared-table` reads `[active, direction]`. The opposite way needs no adapter:
 * the table emits `changeSorting` as a `SortConfig`.
 * @param {SortConfig} sort The store's sort.
 * @returns {TableSortingConfig} The table's sort.
 */
export function toTableSorting({ active, direction }: SortConfig): TableSortingConfig {
  return [active, direction];
}
