import { InjectionToken } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormattingTypes, PropertyFormatting } from '@plastik/shared/formatters';

/**
 * @description An specific configuration for a table column <=> object property.
 */
export type TableColumnFormatting<OBJ, TYPE> = PropertyFormatting<OBJ, TYPE> & {
  /**
   * Sets if a table column must have sorting capacities.
   */
  sorting?: boolean;
  /**
   * Sets styling by CSS classes passed as a single string for the current column.
   */
  cssClasses?: string;
  /**
   * Sets the sticky position value for a given column.
   */
  sticky?: boolean;
};

/**
 * @description Main configuration for a table structure.
 */
export interface TableControlStructure<OBJ = unknown> {
  /**
   * Array with each column configuration properties.
   */
  columnProperties: TableColumnFormatting<OBJ, FormattingTypes>[];
  pagination?: PageEventConfig;
  pageSizeOptions?: number[];
  paginationVisibility?: Partial<TablePaginationVisibility>;
}

/**
 * @description Configuration type for sorting a table.
 * {active} is the current column id.
 * {direction} is the direction of the sorting, 'asc' | 'desc'.
 */
export type TableSorting = Pick<MatSort, 'active' | 'direction'>;

/**
 * @description Configuration type for paginate a table.
 * {previousPageIndex} is the previous page index number with base 0.
 * {pageIndex} is the current page index number with base 0.
 * {pageSize} is the number of items per page.
 */
export type PageEventConfig = Pick<PageEvent, 'previousPageIndex' | 'pageIndex' | 'pageSize'>;

/**
 * @description Configuration for Table Pagination.
 */
export interface TablePaginationVisibility {
  hidePageSize: boolean;
  hidePaginationFirstLastButtons: boolean;
  hideRangeLabel: boolean;
  hideRangeButtons: boolean;
}

/**
 * @description The value to pass on dynamic table component as an @Output value.
 * Output property "changeSwitchEvent" fired on any switchCheckBox controller
 * that applies when any table row is using tableFormatting.BOOLEAN_WITH_CONTROL.
 */
export interface TableSwitchEvent {
  id: string;
  value: boolean;
}

/**
 * @description Default table page size options.
 */
const pageSizeOptions = [15, 25, 50];

/**
 * @description Default TableControlStructure configuration.
 */
export const defaultTableConfig: TableControlStructure = {
  columnProperties: [],
  pageSizeOptions,
  pagination: {
    previousPageIndex: 0,
    pageIndex: 0,
    pageSize: pageSizeOptions[0],
  },
  paginationVisibility: { hidePageSize: false, hidePaginationFirstLastButtons: true, hideRangeLabel: true, hideRangeButtons: true },
};

/**
 * @description Default TableControlStructure Token. It can be mapped, combined or overwritten by any custom or feature configuration.
 */
export const DEFAULT_TABLE_CONFIG = new InjectionToken<TableControlStructure>('DEFAULT_TABLE_CONFIG', {
  providedIn: 'root',
  factory: () => defaultTableConfig,
});
