import { inject, Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { isNil } from '@plastik/shared/objects';

import { Timestamp } from '@angular/fire/firestore';
import {
  FormattingInput,
  FormattingOutput,
  FormattingTypes,
  PropertyFormatting,
  PropertyFormattingConf,
} from '../formatting';
import { SharedUtilFormattersService } from './shared-util-formatters.service';

@Injectable()
/**
 * @description A service to format a value from an object applying a formatting configuration.
 */
export class DataFormatFactoryService<T extends FormattingInput<keyof T>> {
  formatter = inject(SharedUtilFormattersService);

  /**
   * @description Factory to get the correct formatted value from item property with a custom formatting option.
   * @param { unknown } item  The object to extract value from.
   * @param { PropertyFormatting } param The control configuration to format the object property value.
   * @param { string | Function } param.propertyPath The property of the object which value is going to be formatted.
   * @param { PropertyFormattingConf } param.formatting The formatting configuration for a concrete property object.
   * @param {number } index Index to custom formatters (f.e. a table indexing)
   * @param {unknown } extraConfig Extra configuration object to format values specially when using custom formatters.
   * @returns { PropertyFormatting } The valid types to be returned after formatting a value.
   */
  getFormattedValue(
    item: T,
    { propertyPath, formatting }: PropertyFormatting<T, FormattingTypes>,
    index?: number,
    extraConfig?: unknown
  ): SafeHtml {
    const getValueToShow = typeof propertyPath === 'string' ? propertyPath : propertyPath(item);
    const value = this.getValueFromRow(getValueToShow, item);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const { type, extras } = formatting;

    switch (type) {
      case 'DATE':
        return this.formatter.dateFormatter(String(value), extras);
      case 'DATE_TIME':
        return this.formatter.dateTimeFormatter(String(value), extras);
      case 'FIREBASE_TIMESTAMP':
        return this.formatter.firebaseTimestampFormatter(value as Timestamp, extras);
      case 'PERCENTAGE':
        return this.formatter.percentageFormatter(Number(value), extras);
      case 'CURRENCY':
        return this.formatter.currencyFormatter(Number(value), extras);
      case 'NUMBER':
        return this.formatter.numberFormatter(Number(value), extras);
      case 'BOOLEAN_WITH_CONTROL':
        return !!value;
      case 'BOOLEAN_WITH_ICON':
        return this.formatter.booleanWithIconFormatter(!!value, extras);
      case 'TITLE_CASE':
        return this.formatter.titleCaseFormatter(String(value));
      case 'IMAGE':
      case 'CUSTOM':
      case 'LINK':
        return this.formatter.customFormatter(
          String(value),
          formatting as PropertyFormattingConf<T>,
          item,
          index,
          extraConfig
        );
      case 'TEXT':
      case 'INPUT':
      default:
        return this.formatter.defaultFormatter(String(value));
    }
  }

  private getValueFromRow(property: string, item: T): FormattingOutput {
    return property.split('.').reduce((accObject: unknown, currentProp: string) => {
      const object = (accObject as T)[currentProp as keyof T];
      return isNil(object) ? '' : (object as FormattingOutput);
    }, item);
  }
}
