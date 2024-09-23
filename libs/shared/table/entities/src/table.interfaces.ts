import { InjectionToken, WritableSignal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormattingTypes, PropertyFormatting } from '@plastik/shared/formatters';
import { Observable } from 'rxjs';

/**
 * @description An specific configuration for a table column <=> object property.
 */
export type TableColumnFormatting<OBJ, TYPE> = PropertyFormatting<OBJ, TYPE> & {
  /**
   * Sets if a table column must have sorting capacities.
   */
  sorting?: boolean;
  /**
   * Sets styling for the cell and the child container.
   */
  cssClasses?: [cell?: string, content?: string];
  /**
   * Sets the sticky position value for a given column.
   */
  sticky?: boolean;
  /**
   * Adds a title HTML attribute to the cell in order to show the content of it (useful when contents are truncated).
   */
  showTitle?: boolean;
};

/**
 * @description Configuration values for Table Actions.
 */
export type TableControlActionTypes =
  | 'EDIT'
  | 'DELETE'
  | 'PARTIAL_EDIT'
  | 'PREVIEW'
  | 'SELECT'
  | ('CUSTOM' & Uppercase<string>);

export interface TableControlActionDefinition<T> {
  visible: (element: T) => boolean;
  disabled?: (element: T) => boolean;
  execute?: (element: T) => boolean | string | void;
  link?: (element: T) => string[];
  fragment?: (element?: T) => string;
  icon?: (element: T) => string;
  description?: (element?: T) => string;
  order?: number;
  containerBtnClass?: string;
  grouping?: boolean;
}

/**
 * @description Configuration for Table Actions rows.
 */
export type TableControlAction<T> = {
  [field in TableControlActionTypes]?: TableControlActionDefinition<T>;
};

/**
 * @description Main configuration for a table structure.
 */
export interface TableControlStructure<OBJ> {
  /**
   * Array with each column configuration properties.
   */
  columnProperties: TableColumnFormatting<OBJ, FormattingTypes>[];
  pagination?: PageEventConfig;
  pageSizeOptions?: number[];
  paginationVisibility?: Partial<TablePaginationVisibility>;
  sort?: TableSortingConfig;
  /**
   * Main title of the table. Used for accessibility purposes.
   */
  caption?: string;
  actions?: TableControlAction<OBJ>;
  extraRowStyles?: (element: OBJ) => string;
}

/**
 * @description Configuration type for sorting a table.
 * {active} is the current column id.
 * {direction} is the direction of the sorting, 'asc' | 'desc'.
 */
export type TableSorting = Pick<MatSort, 'active' | 'direction'>;

export type TableSortingConfig = [
  active: TableSorting['active'],
  direction: TableSorting['direction'],
];

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

export interface TableStructureConfig<T> {
  getTableStructure(
    overwrite?: ({ key: string } & Record<string, string>) | null,
    tableControlStructureMerge?: Partial<TableControlStructure<T>>
  ): Observable<TableControlStructure<T>> | WritableSignal<TableControlStructure<T>>;
}

/**
 * @description Default TableControlStructure configuration.
 */
export const defaultTableConfig: TableControlStructure<unknown> = {
  columnProperties: [],
  pageSizeOptions,
  pagination: {
    previousPageIndex: 0,
    pageIndex: 0,
    pageSize: pageSizeOptions[0],
  },
  paginationVisibility: {
    hidePageSize: false,
    hidePaginationFirstLastButtons: true,
    hideRangeLabel: true,
    hideRangeButtons: true,
  },
};

/**
 * @description Default TableControlStructure Token. It can be mapped, combined or overwritten by any custom or feature configuration.
 */
export const DEFAULT_TABLE_CONFIG = new InjectionToken<TableControlStructure<unknown>>(
  'DEFAULT_TABLE_CONFIG',
  {
    providedIn: 'root',
    factory: () => defaultTableConfig,
  }
);

export const TABLE_TOKEN = new InjectionToken<TableStructureConfig<unknown>>('TABLE_TOKEN');
