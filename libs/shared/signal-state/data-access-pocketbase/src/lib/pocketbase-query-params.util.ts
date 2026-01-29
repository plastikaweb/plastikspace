import { BasePocketBaseEntityFilter, SortConfig } from '@plastik/core/entities';
import { PocketBaseGetListState } from './pocketbase-store.types';
import { BasePocketBaseEntityPagination } from '@plastik/core/entities';

interface NormalizedPocketBaseParams {
  pagination: BasePocketBaseEntityPagination;
  sort: SortConfig;
  filter: BasePocketBaseEntityFilter;
}

/**
 * Parses a number from a value.
 * @param {unknown} value The value to parse.
 * @returns {number | undefined} The parsed number, or undefined if the value is not a number.
 */
const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

/**
 * Parses a direction from a value.
 * @param {unknown} value The value to parse.
 * @returns {"asc" | "desc" | undefined} The parsed direction, or undefined if the value is not a valid direction.
 */
const parseDirection = (value: unknown): 'asc' | 'desc' | undefined =>
  value === 'asc' || value === 'desc' ? value : undefined;

/**
 * Normalizes a filter value.
 * @param {unknown} value The value to normalize.
 * @returns {string | boolean | null} The normalized value, or null if the value is not a valid filter value.
 */
const normalizeFilterValue = (value: unknown): string | boolean | null => {
  if (value === null) {
    return null;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (typeof value === 'string') {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    if (value === 'null') {
      return null;
    }
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return normalizeFilterValue(value[0]);
  }
  return null;
};

/**
 * Normalizes PocketBase query parameters.
 * @param {Record<string, unknown> | undefined} rawParams The raw parameters to normalize.
 * @param {PocketBaseGetListState} defaultState The default state to use for normalization.
 * @returns {NormalizedPocketBaseParams} The normalized parameters.
 */
export const normalizePocketBaseParams = (
  rawParams: Record<string, unknown> | undefined,
  defaultState: PocketBaseGetListState
): NormalizedPocketBaseParams => {
  const { page, perPage, sort, direction, ...rest } = rawParams ?? {};

  const pagination: BasePocketBaseEntityPagination = {
    page: parseNumber(page) ?? defaultState.pagination.page,
    perPage: parseNumber(perPage) ?? defaultState.pagination.perPage,
  };

  const sorting: SortConfig = {
    active: typeof sort === 'string' && sort.length > 0 ? sort : defaultState.sort.active,
    direction: parseDirection(direction) ?? defaultState.sort.direction,
  };

  const filterEntries = Object.entries(rest).reduce<BasePocketBaseEntityFilter>(
    (acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }
      acc[key] = normalizeFilterValue(value);
      return acc;
    },
    {}
  );

  return {
    pagination,
    sort: sorting,
    filter: Object.keys(filterEntries).length > 0 ? filterEntries : defaultState.filter,
  };
};
