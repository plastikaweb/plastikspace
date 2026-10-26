import { inject, Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { SafeHtml } from '@angular/platform-browser';
import { BaseEntity } from '@plastik/core/entities';
import { isNil } from '@plastik/shared/objects';

import {
  FormattingComponentOutput,
  FormattingInput,
  FormattingOutput,
  FormattingTypes,
  PropertyComponentFormattingConf,
  PropertyFormatting,
  PropertyFormattingConf,
} from '../formatting';
import { SharedUtilFormattersService } from './shared-util-formatters.service';

/** Maximum entries in PATH_CACHE before clearing to avoid unbounded memory growth. */
const MAX_CACHE_SIZE = 500;
/** Bounded cache storing parsed dot-separated property paths. */
const PATH_CACHE = new Map<string, string[]>();

/**
 * @description A service to format a value from an object applying a formatting configuration.
 */
@Injectable()
export class DataFormatFactoryService<T extends FormattingInput<keyof T> & BaseEntity> {
  readonly #formatter = inject(SharedUtilFormattersService);

  /**
   * Factory to get the correct formatted value from item property with a custom formatting option.
   * @param {T} rowEntity The object to extract value from.
   * @param {PropertyFormatting} param The control configuration to format the object property value.
   * @param {string} param.pathToKey The dot-separated property path or key.
   * @param {PropertyFormattingConf} param.formatting The formatting configuration for a concrete property object.
   * @param {number} [index] Index to custom formatters (e.g. table indexing).
   * @param {unknown} [extraConfig] Extra configuration object to format values specially when using custom formatters.
   * @returns {SafeHtml | string | FormattingComponentOutput} The formatted value or component configuration.
   */
  getFormattedValue(
    rowEntity: T extends BaseEntity ? T : never,
    { pathToKey, formatting }: PropertyFormatting<T, FormattingTypes>,
    index?: number,
    extraConfig?: unknown
  ): SafeHtml | string | FormattingComponentOutput {
    const value = this.#getValueFromRow(pathToKey, rowEntity);
    const { type, extras } = formatting;

    switch (type) {
      case 'DATE':
        return this.#formatter.dateFormatter(String(value), extras);
      case 'DATE_TIME':
        return this.#formatter.dateTimeFormatter(String(value), extras);
      case 'FIREBASE_TIMESTAMP':
        return this.#formatter.firebaseTimestampFormatter(value as Timestamp, extras);
      case 'PERCENTAGE':
        return this.#formatter.percentageFormatter(Number(value), extras);
      case 'CURRENCY':
        return this.#formatter.currencyFormatter(Number(value), extras);
      case 'NUMBER':
        return this.#formatter.numberFormatter(Number(value), extras);
      case 'QUANTITY':
        return this.#formatter.quantityFormatter(Number(value), rowEntity, extras);
      case 'BOOLEAN_WITH_CONTROL':
        return !!value;
      case 'BOOLEAN_WITH_ICON':
        return this.#formatter.booleanWithIconFormatter(!!value, extras);
      case 'TITLE_CASE':
        return this.#formatter.titleCaseFormatter(String(value));
      case 'IMAGE':
      case 'CUSTOM':
      case 'LINK':
        return this.#formatter.customFormatter(
          String(value),
          formatting as PropertyFormattingConf<T extends BaseEntity ? T : never>,
          rowEntity,
          index,
          extraConfig
        );
      case 'COMPONENT':
        return this.#formatter.componentFormatter(
          String(value),
          formatting as PropertyComponentFormattingConf<T extends BaseEntity ? T : never, unknown>,
          rowEntity,
          index
        );
      case 'TEXT':
      case 'INPUT':
      default:
        return this.#formatter.defaultFormatter(String(value));
    }
  }

  /**
   * Retrieves a value from an object based on a dot-separated property path.
   * Fast-paths non-nested keys and uses a cached key array with a loop for nested keys to eliminate allocations.
   * @param {string} property - The dot-separated path to the property.
   * @param {T} rowEntity - The object to extract the value from.
   * @returns {FormattingOutput} The value at the specified path, or an empty string if not found.
   */
  #getValueFromRow(property: string, rowEntity: T extends BaseEntity ? T : never): FormattingOutput {
    if (!rowEntity) {
      return '';
    }

    if (!property.includes('.')) {
      const value = rowEntity[property as keyof T];

      return isNil(value) ? '' : (value as FormattingOutput);
    }

    let pathParts = PATH_CACHE.get(property);

    if (!pathParts) {
      if (PATH_CACHE.size >= MAX_CACHE_SIZE) {
        PATH_CACHE.clear();
      }
      pathParts = property.split('.');
      PATH_CACHE.set(property, pathParts);
    }

    let current: unknown = rowEntity;

    for (let i = 0; i < pathParts.length; i++) {
      if (isNil(current) || typeof current !== 'object') {
        return '';
      }
      current = (current as Record<string, unknown>)[pathParts[i]];
    }

    return isNil(current) ? '' : (current as FormattingOutput);
  }
}
