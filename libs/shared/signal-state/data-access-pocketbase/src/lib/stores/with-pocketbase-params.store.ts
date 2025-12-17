import { updateState } from '@angular-architects/ngrx-toolkit';
import { signalStoreFeature, SignalStoreFeature, type, withMethods } from '@ngrx/signals';
import {
  BasePocketBaseEntityFilter,
  BasePocketBaseEntityPagination,
  SortConfig,
} from '@plastik/core/entities';
import { initialGetListState, PocketBaseGetListState } from '../pocketbase-store.types';

interface NormalizedPocketBaseParams {
  pagination: BasePocketBaseEntityPagination;
  sort: SortConfig;
  filter: BasePocketBaseEntityFilter;
}

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

const normalizePocketBaseParams = (
  rawParams: Record<string, unknown> | undefined,
  defaultState: PocketBaseGetListState
): NormalizedPocketBaseParams => {
  const { page, perPage, active, direction, ...rest } = rawParams ?? {};

  const pagination: BasePocketBaseEntityPagination = {
    page: parseNumber(page) ?? defaultState.pagination.page,
    perPage: parseNumber(perPage) ?? defaultState.pagination.perPage,
  };

  const sorting: SortConfig = {
    active: typeof active === 'string' && active.length > 0 ? active : defaultState.sort.active,
    direction: parseDirection(direction) ?? defaultState.sort.direction,
  };

  const filterEntries = Object.entries(rest).reduce<BasePocketBaseEntityFilter>(
    (acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }
      const normalizedValue = normalizeFilterValue(value);
      if (normalizedValue !== null) {
        acc[key] = normalizedValue;
      }
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

/**
 * @description Signal store feature for PocketBase list operations with pagination, sorting, and filtering.
 * @param { object } root0 Configuration object.
 * @param { string } root0.featureName The name of the feature for DevTools and logging.
 * @param { Partial<PocketBaseGetListState> } root0.customInitialState Custom initial state overrides for pagination, sort and filter.
 * @returns { SignalStoreFeature } Signal store feature.
 */
export function withPocketBaseParamsFeature({
  featureName,
  customInitialState,
}: {
  featureName: string;
  customInitialState: Partial<PocketBaseGetListState>;
}) {
  const defaultState = initialGetListState(customInitialState);
  return signalStoreFeature(
    {
      state: type<PocketBaseGetListState>(),
    },
    withMethods(store => {
      return {
        setParams: (rawParams?: Record<string, unknown>) => {
          const normalized = normalizePocketBaseParams(rawParams, defaultState);

          updateState(store, `[${featureName}] ${JSON.stringify(normalized)} set params`, {
            pagination: normalized.pagination,
            filter: normalized.filter,
            sort: normalized.sort,
          });
        },
      };
    })
  );
}
