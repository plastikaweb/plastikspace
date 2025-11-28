import { PageEventConfig } from '@plastik/shared/table/entities';

/**
 * @description The pagination configuration for Firebase queries.
 * Includes cursor-based pagination using the last element of each page.
 * @template T The type of the entity.
 */
export type FirebaseCrudPagination<T> = Omit<PageEventConfig, 'previousPageIndex'> & {
  pageLastElements: Map<number, T>;
};

/**
 * @description The filter criteria for Firebase queries.
 * A simple key-value object where values can be strings, booleans, or null.
 */
export type FirebaseCrudFilter = Record<string, string | null | boolean>;
