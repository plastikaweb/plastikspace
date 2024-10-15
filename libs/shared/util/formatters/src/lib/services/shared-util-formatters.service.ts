/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  TitleCasePipe,
} from '@angular/common';
import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Timestamp } from '@angular/fire/firestore';
import { FormattingDateInput, FormattingExtras, PropertyFormattingConf } from '../formatting';

@Injectable()
/**
 * @description A service to serve formatting methods.
 */
export class SharedUtilFormattersService {
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly locale = inject(LOCALE_ID);

  dateFormatter<T>(
    value: FormattingDateInput,
    extras?: () => Partial<
      Pick<FormattingExtras<T, 'DATE'>, 'dateDigitsInfo' | 'locale' | 'timezone'>
    >
  ): string {
    let format = {
      dateDigitsInfo: 'shortDate',
      locale: this.locale,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    if (extras) {
      format = {
        ...format,
        ...extras(),
      };
    }

    return formatDate(value, format.dateDigitsInfo, format.locale, format.timezone) || '';
  }

  dateTimeFormatter<T>(
    value: FormattingDateInput,
    extras?: () => Partial<Pick<FormattingExtras<T, 'DATE_TIME'>, 'locale' | 'timezone'>>
  ): string {
    let format = {
      locale: this.locale,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    if (extras) {
      format = {
        ...format,
        ...extras(),
      };
    }
    return formatDate(value, 'M/d/yy, HH:mm:ss', format.locale, format.timezone) || '';
  }

  firebaseTimestampFormatter<T>(
    value: Timestamp,
    extras?: () => Partial<
      Pick<FormattingExtras<T, 'DATE'>, 'dateDigitsInfo' | 'locale' | 'timezone'>
    >
  ): string {
    let format = {
      dateDigitsInfo: 'shortDate',
      locale: this.locale,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    if (extras) {
      format = {
        ...format,
        ...extras(),
      };
    }

    return value
      ? formatDate(value?.toDate(), format.dateDigitsInfo, format.locale, format.timezone)
      : '-';
  }

  percentageFormatter<T>(
    value: number,
    extras?: () => Partial<Pick<FormattingExtras<T, 'PERCENTAGE'>, 'numberDigitsInfo' | 'locale'>>
  ): string {
    let format = {
      numberDigitsInfo: '1.2-2',
      locale: this.locale,
    };
    if (extras) {
      format = {
        ...format,
        ...extras(),
      };
    }

    return formatPercent(Number(value) / 100, format.locale, format.numberDigitsInfo) || '';
  }

  currencyFormatter<T>(
    value: number,
    extras?: () => Partial<
      Pick<
        FormattingExtras<T, 'CURRENCY'>,
        'numberDigitsInfo' | 'locale' | 'currency' | 'currencyCode'
      >
    >
  ): string {
    let format = {
      numberDigitsInfo: '1.0-0',
      locale: this.locale,
      currency: '$',
      currencyCode: 'USD',
    };
    if (extras) {
      format = {
        ...format,
        ...extras(),
      };
    }
    return (
      formatCurrency(
        value,
        format.locale,
        format.currency,
        format.currencyCode,
        format.numberDigitsInfo
      ) || ''
    );
  }

  numberFormatter<T>(
    value: number,
    extras?: () => Partial<Pick<FormattingExtras<T, 'NUMBER'>, 'numberDigitsInfo' | 'locale'>>
  ): string {
    let format = {
      numberDigitsInfo: '1.2-2',
      locale: this.locale,
    };
    if (extras) {
      format = {
        ...format,
        ...extras(),
      };
    }
    return formatNumber(Number(value), format.locale, format.numberDigitsInfo) || '';
  }

  /**
   * @description Formats value as title case (value => `Value`).
   * @param { string } value The value to format.
   * @returns { string } The formatted value.
   */
  titleCaseFormatter(value: string): string {
    return this.titleCasePipe.transform(value);
  }

  imageFormatter<T>(value: string, item: T, extras?: () => FormattingExtras<T, 'IMAGE'>): SafeHtml {
    const imgTitle = extras?.().title?.(item) || '';
    const classes = extras?.().classes || '';

    return this.sanitizer.bypassSecurityTrustHtml(
      `<img alt="${imgTitle}" src="${value}" class="${classes}">`
    );
  }

  booleanWithIconFormatter<T>(
    value: boolean,
    extras?: () => FormattingExtras<T, 'BOOLEAN_WITH_ICON'>
  ): SafeHtml {
    let format = {
      iconTrue: 'check',
      iconFalse: 'close',
    };
    if (extras) {
      format = {
        ...format,
        ...extras(),
      };
    }
    return this.sanitizer.bypassSecurityTrustHtml(
      `<span class="material-icons">${value ? format.iconTrue : format.iconFalse}</span>`
    );
  }

  /**
   * @description Formats value passing a custom method to format it.
   * @param { string } value The value to format.
   * @param { PropertyFormattingConf } param The control configuration to format the object property value.
   * @param { Function } param.execute  The function to execute to format the value.
   * @param { T } element The whole item object where the formatting property belongs.
   * @param { number } index The index of the object i a list (f.e. a table).
   * @param { T } extraConfig Extra configuration object to format values when defining `execute` method blueprint.
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
