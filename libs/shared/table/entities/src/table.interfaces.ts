import { InjectionToken, Signal, signal } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PageEvent } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { EntityId } from '@ngrx/signals/entities';
import {
  FormattingComponentOutput,
  FormattingTypes,
  PropertyFormatting,
} from '@plastik/shared/formatters';

/**
 * Represents the base interface for an editable attribute.
 * @template T - The type of the item that the attribute belongs to.
 */
export interface EditableAttributeBase<T> {
  /**
   * The type of the editable attribute.
   */
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'toggle' | 'radio';

  /**
   * The attributes of the editable attribute.
   */
  attributes: {
    /**
     * The label of the attribute.
     */
    label?: string;

    /**
     * The placeholder text for the attribute.
     */
    placeholder?: string;

    /**
     * The suffix text for the attribute.
     */
    suffix?: string;

    /**
     * The prefix text for the attribute.
     */
    prefix?: string;

    /**
     * Indicates whether the attribute is disabled.
     */
    disabled?: boolean;

    /**
     * The styles to be applied to the attribute.
     */
    styles?: string;
  };

  /**
   * A callback function that is called when the value of the attribute changes.
   * @param value - The new value of the attribute.
   * @param item - The item that the attribute belongs to.
   * @returns The updated item.
   */
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

/**
 * Represents a union type of various editable attribute types for an object.
 * @template OBJ - The type of the object that the attributes belong to.
 * @see EditableCheckboxAttributes
 * @see EditableToggleAttributes
 * @see EditableRadioAttributes
 * @see EditableSelectAttributes
 * @see EditableTextareaAttributes
 * @see EditableTextAttributes
 * @see EditableNumberAttributes
 */
type EditableAttributes<OBJ> =
  | EditableCheckboxAttributes<OBJ>
  | EditableToggleAttributes<OBJ>
  | EditableRadioAttributes<OBJ>
  | EditableSelectAttributes<OBJ>
  | EditableTextareaAttributes<OBJ>
  | EditableTextAttributes<OBJ>
  | EditableNumberAttributes<OBJ>;

/**
 * Type guard function to check if the given attributes are of type `EditableTextAttributes`.
 * @template T - The type of the attributes.
 * @param {EditableAttributes<T>} attributes - The attributes to check.
 * @returns {boolean} True if the attributes are of type `EditableTextAttributes`, otherwise false.
 */
export const isTextTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableTextAttributes<T> => attributes.type === 'text';

/**
 * Type guard function to check if the given attributes are of type `EditableNumberAttributes`.
 * @template T - The type of the attributes.
 * @param {EditableAttributes<T>} attributes - The attributes to check.
 * @returns {boolean} True if the attributes are of type `EditableNumberAttributes`, otherwise false.
 */
export const isNumberTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableNumberAttributes<T> => attributes.type === 'number';

/**
 * Type guard function to check if the given attributes are of type `EditableSelectAttributes`.
 * @template T - The type of the attributes.
 * @param {EditableAttributes<T>} attributes - The attributes to check.
 * @returns {boolean} True if the attributes are of type `EditableSelectAttributes`, otherwise false.
 */
export const isSelectTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableSelectAttributes<T> => attributes.type === 'select';

/**
 * Type guard function to check if the given attributes are of type `EditableTextareaAttributes`.
 * @template T - The type of the attributes.
 * @param {EditableAttributes<T>} attributes - The attributes to check.
 * @returns {boolean} True if the attributes are of type `EditableTextareaAttributes`, otherwise false.
 */
export const isTextareaTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableTextareaAttributes<T> => attributes.type === 'textarea';

/**
 * Type guard function to check if the given attributes are of type `EditableCheckboxAttributes`.
 * @template T - The type of the attributes.
 * @param {EditableAttributes<T>} attributes - The attributes to check.
 * @returns {boolean} `true` if the attributes are of type `EditableCheckboxAttributes`, otherwise `false`.
 */
export const isCheckboxTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableCheckboxAttributes<T> => attributes.type === 'checkbox';

/**
 * Type guard function to check if the given attributes are of type `EditableRadioAttributes`.
 * @template T - The type of the attributes.
 * @param {EditableAttributes<T>} attributes - The attributes to check.
 * @returns {boolean} `true` if the attributes are of type `EditableRadioAttributes`, otherwise `false`.
 */
export const isRadioTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableRadioAttributes<T> => attributes.type === 'radio';

/**
 * Type guard function to check if the given attributes are of type `EditableToggleAttributes`.
 * @template T - The type of the attributes.
 * @param {EditableAttributes<T>} attributes - The attributes to check.
 * @returns {boolean} `true` if the attributes are of type `EditableToggleAttributes`, otherwise `false`.
 */
export const isToggleTypeGuard = <T>(
  attributes: EditableAttributes<T>
): attributes is EditableToggleAttributes<T> => attributes.type === 'toggle';

/**
 * Type guard function to check if the given value is of type `FormattingComponentOutput`.
 * @param {unknown} value - The value to check.
 * @returns {boolean} True if the value is of type `FormattingComponentOutput`, otherwise false.
 */
export const isDynamicComponentTypeGuard = (value: unknown): value is FormattingComponentOutput => {
  return typeof value === 'object' && value !== null && 'component' in value;
};

/**
 * @description An specific configuration for a table column <=> object property.
 */
export type TableColumnFormatting<OBJ, TYPE> = PropertyFormatting<OBJ, TYPE> & {
  /**
   * Sets if a table column must have sorting capacities.
   */
  sorting?: string;
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

/**
 * Interface representing the definition of a table control action.
 * @template T - The type of the element that the action will be performed on.
 */
export interface TableControlActionDefinition<T> {
  /**
   * Determines whether the action is visible for the given element.
   * @param element - The element to check visibility for.
   * @returns `true` if the action is visible, otherwise `false`.
   */
  visible: (element: T) => boolean;

  /**
   * Determines whether the action is disabled for the given element.
   * @param element - The element to check if the action is disabled.
   * @returns `true` if the action is disabled, otherwise `false`.
   */
  disabled?: (element: T) => boolean;

  /**
   * Executes the action for the given element.
   * @param element - The element to execute the action on.
   * @returns The result of the action, which can be a boolean, string, the element itself, or void.
   */
  execute?: (element: T) => boolean | string | T | void;

  /**
   * Generates a link for the given element.
   * @param element - The element to generate the link for.
   * @returns An array of strings representing the link.
   */
  link?: (element: T) => string[];

  /**
   * Generates a fragment identifier for the given element.
   * @param element - The element to generate the fragment for.
   * @returns A string representing the fragment identifier.
   */
  fragment?: (element?: T) => string;

  /**
   * Retrieves the icon for the given element.
   * @param element - The element to get the icon for.
   * @returns A string representing the icon.
   */
  icon?: (element: T) => string;

  /**
   * Retrieves the description for the given element.
   * @param element - The element to get the description for.
   * @returns A string representing the description.
   */
  description?: (element: T) => string;

  /**
   * Specifies the order in the UI of the action.
   */
  order?: number;

  /**
   * Specifies the CSS class for the container button.
   */
  containerBtnClass?: string;

  /**
   * Indicates whether the action is part of a grouping.
   */
  grouping?: boolean;

  /**
   * Specifies the type of the action.
   */
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
  columnProperties: Signal<TableColumnFormatting<OBJ, FormattingTypes>[]>;
  pagination?: Signal<PageEventConfig>;
  noPagination?: boolean;
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
  rowHeight?: `${number}px` | `${number}vh` | `${number}rem` | `${number}em` | 'unset';
  getData?: (id?: string) => OBJ[];
  getSelectedItemId?: Signal<EntityId | null>;
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
 * Interface representing the configuration for a table structure.
 * @template T - The type of the table data.
 */
export interface TableStructureConfig<T> {
  /**
   * Retrieves the table definition.
   * @param overwrite - An optional object that can overwrite specific keys in the table definition.
   * @param tableControlStructureMerge - An optional partial table definition to merge with the existing one.
   * @returns An observable or signal that emits the table definition.
   */
  getTableDefinition(
    overwrite?: ({ key: string } & Record<string, string>) | null,
    tableControlStructureMerge?: Partial<TableDefinition<T>>
  ): TableDefinition<T>;
}

/**
 * @description Default TableControlStructure configuration.
 */
export const defaultTableConfig: TableDefinition<unknown> = {
  columnProperties: signal([]),
  pagination: signal({
    previousPageIndex: 0,
    pageIndex: 0,
    pageSize: pageSizeOptions[0],
  }),
  paginationVisibility: {
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

/**
 * @description Table token.
 * @description This token is used to provide the table structure configuration.
 */
export const TABLE_TOKEN = new InjectionToken<TableStructureConfig<unknown>>('TABLE_TOKEN');
