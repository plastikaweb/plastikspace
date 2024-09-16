import { SafeHtml } from '@angular/platform-browser';

/**
 * @description Formatting types members.
 */

export type FormattingTypes =
  | 'DATE'
  | 'DATE_TIME'
  | 'PERCENTAGE'
  | 'CURRENCY'
  | 'NUMBER'
  | 'BOOLEAN_WITH_CONTROL'
  | 'BOOLEAN_WITH_ICON'
  | 'TITLE_CASE'
  | 'IMAGE'
  | 'LINK'
  | 'CUSTOM'
  | 'TEXT';

type FormattingTypesNumeric = Extract<
  FormattingTypes,
  'DATE' | 'DATE_TIME' | 'PERCENTAGE' | 'CURRENCY' | 'NUMBER'
>;
type FormattingTypesBoolean = Extract<FormattingTypes, 'BOOLEAN_WITH_ICON'>;

type FormattingTypesDefault = Extract<
  FormattingTypes,
  'BOOLEAN_WITH_CONTROL' | 'LINK' | 'CUSTOM' | 'TEXT' | 'TITLE_CASE'
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

type FormattingImageExtras<OBJ> = {
  type: 'svg' | 'img';
  title: string | ((item: OBJ) => string);
  classes?: string;
  svgClass?: string;
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

/**
 * @description Formatting extras blueprint based on
 */
export type FormattingExtras<OBJ, TYPE extends FormattingTypes> = TYPE extends 'IMAGE'
  ? Partial<FormattingImageExtras<OBJ>>
  : TYPE extends FormattingTypesNumeric
    ? FormattingNumericExtras
    : TYPE extends FormattingTypesBoolean
      ? FormattingBooleanWithIconExtras
      : object;

/**
 * @description Formatting property blueprint.
 */
export interface PropertyFormattingConf<OBJ, TYPE extends FormattingTypes = 'TEXT'> {
  type: TYPE;
  execute?: (value: unknown, element?: OBJ, index?: number, extras?: unknown) => FormattingOutput;
  extras?: FormattingExtras<OBJ, TYPE>;
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
/**
 * @description The blueprint for any formatting item constraint by its FormattingTypes value.
 */
export type PropertyFormatting<OBJ, TYPE = 'TEXT'> = TYPE extends FormattingTypesNumeric
  ? PropertyFormattingNumeric<OBJ>
  : TYPE extends 'IMAGE'
    ? PropertyFormattingImage<OBJ>
    : TYPE extends 'BOOLEAN_WITH_ICON'
      ? PropertyFormattingBooleanWithIcon<OBJ>
      : PropertyFormattingDefault<OBJ>;
