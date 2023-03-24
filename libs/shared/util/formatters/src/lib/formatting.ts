import { SafeHtml } from '@angular/platform-browser';

/**
 * @description Formatting types members.
 */
export enum FormattingTypes {
  DATE = 'date',
  DATE_TIME = 'dateTime',
  PERCENTAGE = 'percentage',
  CURRENCY = 'currency',
  NUMBER = 'number',
  BOOLEAN_WITH_CONTROL = 'booleanWithControl',
  TITLE_CASE = 'titleCase',
  IMAGE = 'image',
  LINK = 'link',
  CUSTOM = 'custom',
  TEXT = 'text',
}

type FormattingTypesNumeric = Extract<
  FormattingTypes,
  FormattingTypes.DATE | FormattingTypes.DATE_TIME | FormattingTypes.PERCENTAGE | FormattingTypes.CURRENCY | FormattingTypes.NUMBER
>;
type FormattingTypesDefault = Extract<
  FormattingTypes,
  FormattingTypes.BOOLEAN_WITH_CONTROL | FormattingTypes.LINK | FormattingTypes.CUSTOM | FormattingTypes.TEXT | FormattingTypes.TITLE_CASE
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
}>;

/**
 * @description Formatting extras blueprint based on FormattingTypes.
 */
export type FormattingExtras<OBJ, TYPE> = TYPE extends FormattingTypes.IMAGE
  ? Partial<FormattingImageExtras<OBJ>>
  : TYPE extends FormattingTypesNumeric
  ? FormattingNumericExtras
  : object;

/**
 * @description Formatting property blueprint.
 */
export interface PropertyFormattingConf<OBJ, TYPE extends FormattingTypes = FormattingTypes.TEXT> {
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

type PropertyFormattingDefault<OBJ> = PropertyFormattingBase<OBJ> & PropertyFormattingTypeDef<OBJ, FormattingTypesDefault>;
type PropertyFormattingImage<OBJ> = PropertyFormattingBase<OBJ> & PropertyFormattingTypeDef<OBJ, FormattingTypes.IMAGE>;
type PropertyFormattingNumeric<OBJ> = PropertyFormattingBase<OBJ> & PropertyFormattingTypeDef<OBJ, FormattingTypesNumeric>;

/**
 * @description The blueprint for any formatting item constraint by its FormattingTypes value.
 */
export type PropertyFormatting<OBJ, TYPE = FormattingTypes.TEXT> = TYPE extends FormattingTypesNumeric
  ? PropertyFormattingNumeric<OBJ>
  : TYPE extends FormattingTypes.IMAGE
  ? PropertyFormattingImage<OBJ>
  : PropertyFormattingDefault<OBJ>;
