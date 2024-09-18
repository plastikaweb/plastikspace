import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  TitleCasePipe,
} from '@angular/common';
import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FormattingDateInput, FormattingExtras, PropertyFormattingConf } from '../formatting';

@Injectable()
/**
 * @description A service to serve formatting methods.
 */
export class SharedUtilFormattersService {
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly locale = inject(LOCALE_ID);

  /**
   * @description Formats value as a string date ('M/d/yy').
   * @param { FormattingDateInput } value The value to format.
   * @param { Partial<Pick<FormattingExtras, 'dateDigitsInfo' | 'locale'>> } param The control configuration to format the object property value.
   * @param { string } param.dateDigitsInfo The format string that Angular uses to format dates.
   * @param { string } param.locale The format locale that Angular uses to format dates.
   * @returns { string } The formatted value.
   */
  dateFormatter(
    value: FormattingDateInput,
    {
      dateDigitsInfo = 'shortDate',
      locale = this.locale,
      timezone = 'UTC',
    }: Partial<Pick<FormattingExtras<unknown, 'DATE'>, 'dateDigitsInfo' | 'locale' | 'timezone'>>
  ): string {
    return formatDate(value, dateDigitsInfo, locale, timezone) || '';
  }

  /**
   * @description Formats value as a string date ('M/d/yy, HH:mm:ss').
   * @param { FormattingDateInput } value The value to format.
   * @param { Partial<Pick<FormattingExtras, 'locale'>> } param The control configuration to format the object property value.
   * @param { string } param.locale The format locale that Angular uses to format dates.
   * @returns { string } The formatted value.
   */
  dateTimeFormatter(
    value: FormattingDateInput,
    {
      locale = this.locale,
      timezone = 'UTC',
    }: Partial<Pick<FormattingExtras<unknown, 'DATE_TIME'>, 'locale' | 'timezone'>>
  ): string {
    return formatDate(value, 'M/d/yy, HH:mm:ss', locale, timezone) || '';
  }

  /**
   * @description Formats value as a percentage (value %').
   * @param { string | number | Date } value The value to format.
   * @param { Partial<Pick<FormattingExtras, 'numberDigitsInfo' | 'locale'>> } param The control configuration to format the object property value.
   * @param { string } param.numberDigitsInfo The format string that Angular uses to format numbers.
   * @param { string } param.locale The format locale that Angular uses to format numbers.
   * @returns { string } The formatted value.
   */
  percentageFormatter(
    value: number,
    {
      numberDigitsInfo = '1.2-2',
      locale = this.locale,
    }: Partial<Pick<FormattingExtras<unknown, 'PERCENTAGE'>, 'numberDigitsInfo' | 'locale'>>
  ): string {
    return formatPercent(Number(value) / 100, locale, numberDigitsInfo) || '';
  }

  /**
   * @description Formats value as a currency ($value).
   * @param { number } value The value to format.
   * @param { Partial<Pick<FormattingExtras, 'numberDigitsInfo' | 'locale'>> } param The control configuration to format the object property value.
   * @param { string } param.numberDigitsInfo The format string that Angular uses to format currency.
   * @param { string } param.locale The format locale that Angular uses to format currency.
   * @returns { string } The formatted value.
   */
  currencyFormatter(
    value: number,
    {
      numberDigitsInfo = '1.0-0',
      locale = this.locale,
      currency = '$',
      currencyCode = 'USD',
    }: Partial<
      Pick<
        FormattingExtras<unknown, 'CURRENCY'>,
        'numberDigitsInfo' | 'locale' | 'currency' | 'currencyCode'
      >
    >
  ): string {
    return formatCurrency(value, locale, currency, currencyCode, numberDigitsInfo) || '';
  }

  /**
   * @description Formats value as a number (00.00).
   * @param { number } value The value to format.
   * @param { Partial<Pick<FormattingExtras, 'numberDigitsInfo' | 'locale'>> } param The control configuration to format the object property value.
   * @param { string } param.numberDigitsInfo The format string that Angular uses to format numbers.
   * @param { string } param.locale The format locale that Angular uses to format numbers.
   * @returns { string } The formatted value.
   */
  numberFormatter(
    value: number,
    {
      numberDigitsInfo = '1.2-2',
      locale = this.locale,
    }: Partial<Pick<FormattingExtras<unknown, 'NUMBER'>, 'numberDigitsInfo' | 'locale'>>
  ): string {
    return formatNumber(Number(value), locale, numberDigitsInfo) || '';
  }

  /**
   * @description Formats value as title case (value => `Value`).
   * @param { string } value The value to format.
   * @returns { string } The formatted value.
   */
  titleCaseFormatter(value: string): string {
    return this.titleCasePipe.transform(value);
  }

  /**
   * @description Returns a formatted image.
   * @param { string } value - the value to format.
   * @param { Partial<Pick<FormattingExtras, 'classes' | 'svgClass' | 'type' | 'title'>> } param The control configuration to format the object property value.
   * @param { string } param.classes A string containing CSS classes to apply to the <img> tag.
   * @param { string | ((item: unknown) => string) } param.title A string or method that returns the text to add to the 'alt' <img> tag attribute.
   * @param { unknown } item The full object that contains the property to be formatted.
   * @returns { SafeHtml } The formatted value.
   */
  imageFormatter(
    value: string,
    {
      title = '',
      classes = '',
    }: Partial<Pick<FormattingExtras<unknown, 'IMAGE'>, 'classes' | 'title'>>,
    item: unknown
  ): SafeHtml {
    const imgTitle = typeof title === 'string' ? title : title(item);
    return this.sanitizer.bypassSecurityTrustHtml(
      `<img alt="${imgTitle}" src="${value}" class="${classes}">`
    );
  }

  booleanWithIconFormatter(value: boolean, { iconTrue = '', iconFalse = '' }): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<span class="material-icons">${value ? iconTrue : iconFalse}</span>`
    );
  }

  /**
   * @description Formats value passing a custom method to format it.
   * @param { string } value The value to format.
   * @param { PropertyFormattingConf } param The control configuration to format the object property value.
   * @param { Function } param.execute  The function to execute to format the value.
   * @param { unknown } element The whole item object where the formatting property belongs.
   * @param { number } index The index of the object i a list (f.e. a table).
   * @param { unknown } extraConfig Extra configuration object to format values when defining `execute` method blueprint.
   * @example
   * Returns a value for a row index number in a table.
   * execute: (_, __, index = 0, extraConfig) => {
      const { pageIndex, pageSize } = extraConfig as PageEventConfig;
      return String(index + pageIndex * pageSize);
    },
   * @returns { SafeHtml } The formatted value passed through the execute formatting function.
   */
  customFormatter<T>(
    value: string,
    { execute }: PropertyFormattingConf<T>,
    element: T,
    index?: number,
    extraConfig?: unknown
  ): SafeHtml {
    return execute ? execute(value, element, index, extraConfig) : value ? value : '';
  }

  /**
   * @description Formats value as default passing sanitizer.
   * @param { string } value The value to sanitize.
   * @returns { SafeHtml } The value passed through the sanitizer.
   */
  defaultFormatter(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
