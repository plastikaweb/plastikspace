/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  TitleCasePipe,
} from '@angular/common';
import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BaseEntity } from '@plastik/core/entities';
import { escapeHtml } from '@plastik/shared/objects';

import {
  FormattingComponentOutput,
  FormattingDateInput,
  FormattingExtras,
  PropertyComponentFormattingConf,
  PropertyFormattingConf,
} from '../formatting';

@Injectable()
/**
 * @description A service to serve formatting methods.
 */
export class SharedUtilFormattersService {
  readonly #titleCasePipe = inject(TitleCasePipe);
  readonly #sanitizer = inject(DomSanitizer);
  readonly #locale = inject(LOCALE_ID);
  readonly #timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  /**
   * Formats a date value using the specified formatting options.
   * @param {FormattingDateInput} value The date value to format.
   * @param {() => Partial<Pick<FormattingExtras<'DATE'>, 'dateDigitsInfo' | 'locale' | 'timezone'>>} [extras] An optional function that returns additional formatting options, such as locale and timezone.
   * @returns {string} The formatted date string.
   */
  dateFormatter(
    value: FormattingDateInput,
    extras?: () => Partial<Pick<FormattingExtras<'DATE'>, 'dateDigitsInfo' | 'locale' | 'timezone'>>
  ): string {
    const _extras = extras?.();
    return (
      formatDate(
        value,
        _extras?.dateDigitsInfo ?? 'shortDate',
        _extras?.locale ?? this.#locale,
        _extras?.timezone ?? this.#timezone
      ) || ''
    );
  }

  /**
   * Formats a given date/time value according to the specified locale and timezone.
   * @template T - The type parameter for the formatting extras.
   * @param {FormattingDateInput} value - The date/time value to be formatted.
   * @param {() => Partial<Pick<FormattingExtras<'DATE_TIME'>, 'locale' | 'timezone'>>} [extras] -
   *        An optional function that returns additional formatting options such as locale and timezone.
   * @returns {string} The formatted date/time string.
   */
  dateTimeFormatter(
    value: FormattingDateInput,
    extras?: () => Partial<Pick<FormattingExtras<'DATE_TIME'>, 'locale' | 'timezone'>>
  ): string {
    const _extras = extras?.();
    return (
      formatDate(
        value,
        'M/d/yy, HH:mm:ss',
        _extras?.locale ?? this.#locale,
        _extras?.timezone ?? this.#timezone
      ) || ''
    );
  }

  /**
   * Formats a Firebase `Timestamp` into a string based on the provided formatting options.
   * @param {Timestamp} value - The Firebase `Timestamp` to format.
   * @param {() => Partial<Pick<FormattingExtras<'DATE'>, 'dateDigitsInfo' | 'locale' | 'timezone'>>} [extras] -
   *        An optional function that returns additional formatting options such as `dateDigitsInfo`, `locale`, and `timezone`.
   * @returns {string} - The formatted date string or '-' if the value is not provided.
   */
  firebaseTimestampFormatter(
    value: Timestamp,
    extras?: () => Partial<Pick<FormattingExtras<'DATE'>, 'dateDigitsInfo' | 'locale' | 'timezone'>>
  ): string {
    if (!value) {
      return '-';
    }

    const _extras = extras?.();
    return (
      formatDate(
        value.toDate(),
        _extras?.dateDigitsInfo ?? 'shortDate',
        _extras?.locale ?? this.#locale,
        _extras?.timezone ?? this.#timezone
      ) || ''
    );
  }

  /**
   * Formats a given number as a percentage string.
   * @param {number} value - The number to be formatted as a percentage.
   * @param {() => Partial<Pick<FormattingExtras<'PERCENTAGE'>, 'numberDigitsInfo' | 'locale'>>} [extras] - Optional function that returns additional formatting options.
   * @returns {string} The formatted percentage string.
   */
  percentageFormatter(
    value: number,
    extras?: () => Partial<Pick<FormattingExtras<'PERCENTAGE'>, 'numberDigitsInfo' | 'locale'>>
  ): string {
    const _extras = extras?.();
    return (
      formatPercent(
        Number(value) / 100,
        _extras?.locale ?? this.#locale,
        _extras?.numberDigitsInfo ?? '1.2-2'
      ) || ''
    );
  }

  /**
   * Formats a given number as a currency string.
   * @param {number} value - The numeric value to format as currency.
   * @param {() => Partial<Pick<FormattingExtras<'CURRENCY'>, 'numberDigitsInfo' | 'locale' | 'currency' | 'currencyCode'>>} [extras] - Optional function that returns an object with additional formatting options.
   * @returns {string} - The formatted currency string.
   */
  currencyFormatter(
    value: number,
    extras?: () => Partial<
      Pick<
        FormattingExtras<'CURRENCY'>,
        'numberDigitsInfo' | 'locale' | 'currency' | 'currencyCode'
      >
    >
  ): string {
    const _extras = extras?.();
    return (
      formatCurrency(
        value,
        _extras?.locale ?? this.#locale,
        _extras?.currency ?? '€',
        _extras?.currencyCode ?? 'EUR',
        _extras?.numberDigitsInfo ?? '1.2-2'
      ) || ''
    );
  }

  /**
   * Formats a given number according to specified formatting options.
   * @template T - The type parameter for formatting extras.
   * @param {number} value - The number to format.
   * @param {() => Partial<Pick<FormattingExtras<'NUMBER'>, 'numberDigitsInfo' | 'locale'>>} [extras] - Optional function that returns additional formatting options.
   * @returns {string} - The formatted number as a string.
   */
  numberFormatter(
    value: number,
    extras?: () => Partial<Pick<FormattingExtras<'NUMBER'>, 'numberDigitsInfo' | 'locale'>>
  ): string {
    const _extras = extras?.();
    return (
      formatNumber(
        Number(value),
        _extras?.locale ?? this.#locale,
        _extras?.numberDigitsInfo ?? '1.2-2'
      ) || ''
    );
  }

  /**
   * Formats a given number as a quantity string with optional prefix and suffix.
   * @template T - The type parameter for the base entity.
   * @param {number} value - The numeric value to format.
   * @param {T} item - The item containing the value.
   * @param {(item: T) => Partial<Pick<FormattingExtras<'QUANTITY'>, 'numberDigitsInfo' | 'locale' | 'suffix' | 'prefix'>>} [extras] - Optional function that returns additional formatting options.
   * @returns {string} The formatted quantity string.
   */
  quantityFormatter<T extends BaseEntity>(
    value: number,
    item: T,
    extras?: (
      item: T
    ) => Partial<
      Pick<FormattingExtras<'QUANTITY'>, 'numberDigitsInfo' | 'locale' | 'suffix' | 'prefix'>
    >
  ): string {
    const _extras = extras?.(item);
    const formattedNumber = formatNumber(
      Number(value),
      _extras?.locale ?? this.#locale,
      _extras?.numberDigitsInfo ?? '1.2-2'
    );
    return `${_extras?.prefix ?? ''}${formattedNumber}${_extras?.suffix ?? ''}`.trim();
  }

  /**
   * @description Formats value as title case (value => `Value`).
   * @param { string } value The value to format.
   * @returns { string } The formatted value.
   */
  titleCaseFormatter(value: string): string {
    return this.#titleCasePipe.transform(value);
  }

  /**
   * Formats a boolean value into an HTML string with an icon.
   * @template T - The type parameter for the formatting extras.
   * @param {boolean} value - The boolean value to format.
   * @param {() => FormattingExtras<'BOOLEAN_WITH_ICON'>} [extras] - Optional function to provide additional formatting options.
   * @returns {SafeHtml} - The formatted HTML string with the appropriate icon.
   */
  booleanWithIconFormatter(
    value: boolean,
    extras?: () => FormattingExtras<'BOOLEAN_WITH_ICON'>
  ): SafeHtml {
    const _extras = extras?.();
    return this.#sanitizer.bypassSecurityTrustHtml(
      `<span class="material-icons">${escapeHtml(
        value ? _extras?.iconTrue ?? 'check' : _extras?.iconFalse ?? 'close'
      )}</span>`
    );
  }

  /**
   * Formats a value passing a custom method to format it.
   * @template T - The type of the attributes.
   * @param {string} value - The value to format.
   * @param {PropertyFormattingConf<T>} param - The control configuration to format the object property value.
   * @param {T} element - The whole item object where the formatting property belongs.
   * @param {number} [index] - The index of the object in a list (e.g. a table).
   * @param {unknown} [extraConfig] - Extra configuration object to format values.
   * @returns {SafeHtml} The formatted value passed through the execute formatting function.
   * @example
   * Returns a value for a row index number in a table.
   * execute: (_, __, index = 0, extraConfig) => {
   *   const { pageIndex, pageSize } = extraConfig as PageEventConfig;
   *   return String(index + pageIndex * pageSize);
   * },
   */
  customFormatter<T extends BaseEntity>(
    value: string,
    { execute }: PropertyFormattingConf<T>,
    element: T,
    index?: number,
    extraConfig?: unknown
  ): SafeHtml {
    return execute ? execute(value, element, index, extraConfig) : value ? value : '';
  }

  /**
   * Formats a value using a component-based formatting configuration.
   * @template T - The type of the object containing the value to format.
   * @param {string} value - The value to format.
   * @param {PropertyComponentFormattingConf<T, unknown>} param - The formatting configuration.
   * @param {T} element - The complete object containing the value being formatted.
   * @param {number} [index] - The index of the object in a list (e.g. a table).
   * @returns {FormattingComponentOutput | string} The formatted component configuration or the original value if no execute function is provided.
   */
  componentFormatter<T>(
    value: string,
    { execute }: PropertyComponentFormattingConf<T, unknown>,
    element: T,
    index?: number
  ): FormattingComponentOutput | string {
    return execute ? execute(value, element, index) : value;
  }

  /**
   * Formats value as default passing sanitizer.
   * @param {string} value The value to sanitize.
   * @returns {SafeHtml} The HTML-escaped value passed through the sanitizer.
   */
  defaultFormatter(value: string): SafeHtml {
    return this.#sanitizer.bypassSecurityTrustHtml(escapeHtml(value));
  }
}
