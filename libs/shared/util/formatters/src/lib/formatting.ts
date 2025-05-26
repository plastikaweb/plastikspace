import { Type } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { BaseEntity } from '@plastik/core/entities';

/**
 * @description Formatting types members.
 */

export type FormattingTypes =
  | 'DATE'
  | 'DATE_TIME'
  | 'FIREBASE_TIMESTAMP'
  | 'PERCENTAGE'
  | 'CURRENCY'
  | 'NUMBER'
  | 'QUANTITY'
  | 'BOOLEAN_WITH_CONTROL'
  | 'BOOLEAN_WITH_ICON'
  | 'TITLE_CASE'
  | 'IMAGE'
  | 'LINK'
  | 'CUSTOM'
  | 'TEXT'
  | 'INPUT'
  | 'COMPONENT';

type FormattingTypesNumeric = Extract<
  FormattingTypes,
  'DATE' | 'DATE_TIME' | 'FIREBASE_TIMESTAMP' | 'PERCENTAGE' | 'CURRENCY' | 'NUMBER' | 'QUANTITY'
>;

type FormattingTypesBoolean = Extract<FormattingTypes, 'BOOLEAN_WITH_ICON'>;

type FormattingTypesInput = Extract<FormattingTypes, 'INPUT'>;

type FormattingTypesDefault = Extract<
  FormattingTypes,
  'BOOLEAN_WITH_CONTROL' | 'LINK' | 'CUSTOM' | 'TEXT' | 'TITLE_CASE' | 'IMAGE'
>;

/**
 * @description The formatting object type in `DataFormatService` must extend from this.
 */
export type FormattingInput<T> = Record<keyof T, unknown>;

/**
 * @description Allowed types of input related with Date format.
 */
export type FormattingDateInput = Date | number | string;

/**
 * @description The types allowed for returned values from a formatting utility method.
 */
export type FormattingOutput = Date | number | boolean | string | SafeHtml;

/**
 * @description Formatting image extras blueprint.
 */
type FormattingImageExtras = {
  placeholder: string;
};

/**
 * @description Formatting numeric extras blueprint.
 */
type FormattingNumericExtras = Partial<{
  dateDigitsInfo: string;
  timeDigitsInfo: string;
  numberDigitsInfo: string;
  locale: string;
  timezone: string;
  currency: string;
  currencyCode: string;
}>;

type FormattingQuantityExtras = {
  numberDigitsInfo?: string;
  locale?: string;
  suffix?: string;
  prefix?: string;
};

/**
 * @description Formatting boolean extras blueprint.
 */
type FormattingBooleanWithIconExtras = {
  iconTrue: string;
  iconFalse: string;
};

/**
 * @description Formatting input extras blueprint.
 */
type FormattingInputExtras = {
  type: 'text' | 'number';
  placeholder: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
};

/**
 * @description Formatting extras blueprint based on
 */
export type FormattingExtras<TYPE extends FormattingTypes> = TYPE extends 'IMAGE'
  ? Partial<FormattingImageExtras>
  : TYPE extends 'QUANTITY'
    ? FormattingQuantityExtras
    : TYPE extends FormattingTypesNumeric
      ? FormattingNumericExtras
      : TYPE extends FormattingTypesBoolean
        ? FormattingBooleanWithIconExtras
        : TYPE extends 'INPUT'
          ? FormattingInputExtras
          : object;

/**
 * @description The blueprint for default formatting item.
 */
export interface PropertyFormattingConf<
  OBJ extends BaseEntity,
  TYPE extends FormattingTypes = 'TEXT',
> {
  type: TYPE;
  execute?: (
    value: OBJ[keyof OBJ] | string,
    element?: OBJ,
    index?: number,
    extras?: unknown
  ) => FormattingOutput;
  extras?: (item?: OBJ) => FormattingExtras<TYPE>;
  onInputChanges?: (value: unknown, element: OBJ, index?: number, extras?: unknown) => object;
}

/**
 * @description The types allowed for returned values from a formatting component method.
 */
export type FormattingComponentOutput<COMPONENT = unknown> = {
  component: Type<COMPONENT>;
  inputs?: ComponentInputs<COMPONENT>;
};
/**
 * @description The blueprint for component-based formatting item.
 */
export interface PropertyComponentFormattingConf<OBJ, COMPONENT> {
  type: 'COMPONENT';
  execute: (
    value: OBJ[keyof OBJ] | string,
    element?: OBJ,
    index?: number
  ) => FormattingComponentOutput<COMPONENT>;
}

/**
 * @description The blueprint for formatting item.
 */
type PropertyFormattingBase<OBJ extends Record<keyof OBJ, unknown>> = {
  key: string;
  title: Capitalize<string>;
  pathToKey: string;
  link?: (item?: OBJ) => string | string[];
  queryParams?: (item?: OBJ) => Record<string, string>;
};

/**
 * @description The blueprint for formatting item.
 */
type PropertyFormattingTypeDef<OBJ extends BaseEntity, TYPE extends FormattingTypes> = {
  formatting: PropertyFormattingConf<OBJ, TYPE>;
};

/**
 * @description The blueprint for component-based formatting item.
 */
type ComponentPropertyFormattingTypeDef<OBJ extends BaseEntity, COMPONENT> = {
  formatting: PropertyComponentFormattingConf<OBJ, COMPONENT>;
};

/**
 * @description The blueprint for default formatting item.
 */
type PropertyFormattingDefault<OBJ extends BaseEntity> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, FormattingTypesDefault>;

/**
 * @description The blueprint for image-based formatting item.
 */
type PropertyFormattingImage<OBJ extends BaseEntity> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, 'IMAGE'>;

/**
 * @description The blueprint for quantity-based formatting item.
 */
type PropertyFormattingQuantity<OBJ extends BaseEntity> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, 'QUANTITY'>;

/**
 * @description The blueprint for numeric-based formatting item.
 */
type PropertyFormattingNumeric<OBJ extends BaseEntity> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, FormattingTypesNumeric>;

/**
 * @description The blueprint for boolean-with-icon-based formatting item.
 */
type PropertyFormattingBooleanWithIcon<OBJ extends BaseEntity> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, FormattingTypesBoolean>;

/**
 * @description The blueprint for input-based formatting item.
 */
type PropertyFormattingInput<OBJ extends BaseEntity> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, FormattingTypesInput>;
type PropertyFormattingComponent<OBJ extends BaseEntity, COMPONENT> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, 'COMPONENT'> &
  ComponentPropertyFormattingTypeDef<OBJ, COMPONENT>;

/**
 * @description The blueprint for any formatting item constraint by its FormattingTypes value.
 */
export type PropertyFormatting<
  OBJ extends BaseEntity,
  TYPE = 'TEXT',
  COMPONENT = TYPE extends 'COMPONENT' ? unknown : never,
> = TYPE extends FormattingTypesNumeric
  ? PropertyFormattingNumeric<OBJ>
  : TYPE extends 'IMAGE'
    ? PropertyFormattingImage<OBJ>
    : TYPE extends 'QUANTITY'
      ? PropertyFormattingQuantity<OBJ>
      : TYPE extends 'BOOLEAN_WITH_ICON'
        ? PropertyFormattingBooleanWithIcon<OBJ>
        : TYPE extends 'INPUT'
          ? PropertyFormattingInput<OBJ>
          : TYPE extends 'COMPONENT'
            ? PropertyFormattingComponent<OBJ, COMPONENT>
            : PropertyFormattingDefault<OBJ>;

/**
 * @description The type of inputs for a component based formatting item.
 * this type is used to infer the type of the inputs of a component.
 */
export type ComponentInputs<T> = {
  [K in keyof T]?: T[K] extends { set: (value: infer V) => void }
    ? V
    : T[K] extends () => infer R
      ? R
      : never;
} & {
  [key: string]: never;
};
