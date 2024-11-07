import { InjectionToken, Signal, signal } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PageEvent } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { BaseEntity } from '@plastik/core/entities';
import { FormattingTypes, PropertyFormatting } from '@plastik/shared/formatters';
import { Observable } from 'rxjs';

export interface EditableAttributeBase<T> {
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'toggle' | 'radio';
  attributes: {
    label?: string;
    placeholder?: string;
    suffix?: string;
    prefix?: string;
    disabled?: boolean;
    styles?: string;
  };
  onChanges?: (value: string | number | boolean, item: T) => T;
}

type EditableTextAttributes<T> = EditableAttributeBase<T> & {
  type: 'text';
};

type EditableNumberAttributes<T> = EditableAttributeBase<T> & {
  type: 'number';
  attributes: EditableAttributeBase<T>['attributes'] & {
    min?: number;
    max?: number;
    step?: number;
  };
};

type EditableSelectAttributes<T> = EditableAttributeBase<T> & {
  type: 'select';
  attributes: EditableAttributeBase<T>['attributes'] & {
    options?: { value: unknown; label: string }[];
    multiple?: boolean;
  };
  onChanges?: (value: MatSelectChange, item: T) => T;
};

type EditableTextareaAttributes<T> = EditableAttributeBase<T> & {
  type: 'textarea';
  attributes: EditableAttributeBase<T>['attributes'] & {
    rows?: number;
  };
};

type EditableCheckboxAttributes<T> = EditableAttributeBase<T> & {
  type: 'checkbox';
  attributes: EditableAttributeBase<T>['attributes'] & {
    checked?: boolean;
  };
  onChanges?: (value: MatCheckboxChange, item: T) => T;
};

type EditableToggleAttributes<T> = EditableAttributeBase<T> & {
  type: 'toggle';
  attributes: EditableAttributeBase<T>['attributes'] & {
    checked?: boolean;
  };
  onChanges?: (value: MatSlideToggleChange, item: T) => T;
};

type EditableRadioAttributes<T> = EditableAttributeBase<T> & {
  type: 'radio';
  attributes: EditableAttributeBase<T>['attributes'] & {
    options?: { value: unknown; label: string }[];
  };
  onChanges?: (value: MatRadioChange, item: T) => T;
};

type EditableAttributes<OBJ> =
  | EditableCheckboxAttributes<OBJ>
  | EditableToggleAttributes<OBJ>
  | EditableRadioAttributes<OBJ>
  | EditableSelectAttributes<OBJ>
  | EditableTextareaAttributes<OBJ>
  | EditableTextAttributes<OBJ>
  | EditableNumberAttributes<OBJ>;

export const isTextTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableTextAttributes<T> => attributes.type === 'text';

export const isNumberTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableNumberAttributes<T> => attributes.type === 'number';

export const isSelectTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableSelectAttributes<T> => attributes.type === 'select';

export const isTextareaTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableTextareaAttributes<T> => attributes.type === 'textarea';

export const isCheckboxTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableCheckboxAttributes<T> => attributes.type === 'checkbox';

export const isRadioTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableRadioAttributes<T> => attributes.type === 'radio';

export const isToggleTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableToggleAttributes<T> => attributes.type === 'toggle';

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

  isEditableConfig?: (element: OBJ) => EditableAttributes<OBJ>;
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
  | `CLEAR_${Uppercase<string>}`
  | `SET_${Uppercase<string>}`
  | `UPDATE_${Uppercase<string>}`;

export interface TableControlActionDefinition<T> {
  visible: (element: T) => boolean;
  disabled?: (element: T) => boolean;
  execute?: (element: T) => boolean | string | T | void;
  link?: (element: T) => string[];
  fragment?: (element?: T) => string;
  icon?: (element: T) => string;
  description?: (element?: T) => string;
  order?: number;
  containerBtnClass?: string;
  grouping?: boolean;
  type?: 'custom' | 'input';
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
export interface TableDefinition<OBJ> {
  /**
   * Array with each column configuration properties.
   */
  columnProperties: TableColumnFormatting<OBJ, FormattingTypes>[];
  pagination?: PageEventConfig;
  noPagination?: boolean;
  pageSizeOptions?: number[];
  paginationVisibility?: Partial<TablePaginationVisibility>;
  sort?: Signal<TableSortingConfig>;
  count: Signal<number>;
  /**
   * Main title of the table. Used for accessibility purposes.
   */
  caption?: string;
  actions?: TableControlAction<OBJ>;
  extraRowStyles?: (element: OBJ) => string;
  actionsColStyles?: string;
  getData?: (id?: string) => OBJ[];
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
  getTableDefinition(
    overwrite?: ({ key: string } & Record<string, string>) | null,
    tableControlStructureMerge?: Partial<TableDefinition<T>>
  ): Observable<TableDefinition<T>> | Signal<TableDefinition<T>>;
}

/**
 * @description Default TableControlStructure configuration.
 */
export const defaultTableConfig: TableDefinition<unknown> = {
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
  count: signal(0),
};

/**
 * @description Default TableControlStructure Token. It can be mapped, combined or overwritten by any custom or feature configuration.
 */
export const DEFAULT_TABLE_CONFIG = new InjectionToken<TableDefinition<unknown>>(
  'DEFAULT_TABLE_CONFIG',
  {
    providedIn: 'root',
    factory: () => defaultTableConfig,
  }
);

export const TABLE_TOKEN = new InjectionToken<TableStructureConfig<unknown>>('TABLE_TOKEN');
