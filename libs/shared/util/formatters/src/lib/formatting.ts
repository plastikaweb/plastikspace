import { SafeHtml } from '@angular/platform-browser';

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
  | 'BOOLEAN_WITH_CONTROL'
  | 'BOOLEAN_WITH_ICON'
  | 'TITLE_CASE'
  | 'IMAGE'
  | 'LINK'
  | 'CUSTOM'
  | 'TEXT'
  | 'INPUT';

type FormattingTypesNumeric = Extract<
  FormattingTypes,
  'DATE' | 'DATE_TIME' | 'FIREBASE_TIMESTAMP' | 'PERCENTAGE' | 'CURRENCY' | 'NUMBER'
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

type FormattingImageExtras = {
  placeholder: string;
};

type FormattingNumericExtras = Partial<{
  dateDigitsInfo: string;
  timeDigitsInfo: string;
  numberDigitsInfo: string;
  locale: string;
  timezone: string;
  currency: string;
  currencyCode: string;
}>;

type FormattingBooleanWithIconExtras = {
  iconTrue: string;
  iconFalse: string;
};

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
  : TYPE extends FormattingTypesNumeric
    ? FormattingNumericExtras
    : TYPE extends FormattingTypesBoolean
      ? FormattingBooleanWithIconExtras
      : TYPE extends 'INPUT'
        ? FormattingInputExtras
        : object;

/**
 * @description Formatting property blueprint.
 */
export interface PropertyFormattingConf<OBJ, TYPE extends FormattingTypes = 'TEXT'> {
  type: TYPE;
  execute?: (
    value: OBJ[keyof OBJ] | string,
    element?: OBJ,
    index?: number,
    extras?: unknown
  ) => FormattingOutput;
  extras?: (value?: OBJ) => FormattingExtras<TYPE>;
  onInputChanges?: (value: unknown, element: OBJ, index?: number, extras?: unknown) => object;
}

type PropertyFormattingBase<OBJ extends Record<keyof OBJ, unknown>> = {
  key: string & keyof OBJ;
  title: Capitalize<string>;
  propertyPath: string | ((item: OBJ) => string);
};

type PropertyFormattingTypeDef<OBJ, TYPE extends FormattingTypes> = {
  formatting: PropertyFormattingConf<OBJ, TYPE>;
};

type PropertyFormattingDefault<OBJ> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, FormattingTypesDefault>;
type PropertyFormattingImage<OBJ> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, 'IMAGE'>;
type PropertyFormattingNumeric<OBJ> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, FormattingTypesNumeric>;
type PropertyFormattingBooleanWithIcon<OBJ> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, FormattingTypesBoolean>;
type PropertyFormattingInput<OBJ> = PropertyFormattingBase<OBJ> &
  PropertyFormattingTypeDef<OBJ, FormattingTypesInput>;

/**
 * @description The blueprint for any formatting item constraint by its FormattingTypes value.
 */
export type PropertyFormatting<OBJ, TYPE = 'TEXT'> = TYPE extends FormattingTypesNumeric
  ? PropertyFormattingNumeric<OBJ>
  : TYPE extends 'IMAGE'
    ? PropertyFormattingImage<OBJ>
    : TYPE extends 'BOOLEAN_WITH_ICON'
      ? PropertyFormattingBooleanWithIcon<OBJ>
      : TYPE extends 'INPUT'
        ? PropertyFormattingInput<OBJ>
        : PropertyFormattingDefault<OBJ>;
