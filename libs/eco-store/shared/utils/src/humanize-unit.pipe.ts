import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductUnitType } from '@plastik/eco-store/entities';

/** Bounded module-level cache for Intl.NumberFormat instances. */
const FORMATTER_CACHE = new Map<string, Intl.NumberFormat>();
const MAX_CACHE_SIZE = 100;

/**
 * Retrieves or creates a cached Intl.NumberFormat instance for a language and integer/decimal option.
 * @param {string | undefined} lang - The current language code.
 * @param {boolean} isInteger - Whether to format as an integer without decimal digits.
 * @returns {Intl.NumberFormat} The cached number formatter instance.
 */
function getNumberFormatter(lang: string | undefined, isInteger: boolean): Intl.NumberFormat {
  const cacheKey = `${lang ?? ''}_${isInteger ? 'int' : 'dec'}`;
  let formatter = FORMATTER_CACHE.get(cacheKey);

  if (!formatter) {
    if (FORMATTER_CACHE.size >= MAX_CACHE_SIZE) {
      FORMATTER_CACHE.clear();
    }
    formatter = new Intl.NumberFormat(lang, {
      maximumFractionDigits: 2,
      minimumFractionDigits: isInteger ? 0 : 2,
    });
    FORMATTER_CACHE.set(cacheKey, formatter);
  }

  return formatter;
}

/**
 * Pipe to format product numeric values with localized unit representations.
 */
@Pipe({
  name: 'humanizeUnit',
})
export class HumanizeUnitPipe implements PipeTransform {
  readonly #translate = inject(TranslateService);

  /**
   * Transforms a numeric unit value into a localized human-readable string.
   * @param {number | null | undefined} value - The numeric value to format.
   * @param {ProductUnitType} unitType - The type of unit (volume, weight, unit, etc.).
   * @returns {string} The localized unit representation.
   */
  transform(value: number | null | undefined, unitType: ProductUnitType): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '';

    const lang = this.#translate.getCurrentLang?.();
    // avoid unwanted line break
    const spacer = '\u00A0';

    const format = (num: number) => getNumberFormatter(lang, num % 1 === 0).format(num);

    switch (unitType) {
      case 'volume':
      case 'unitWithFixedVolume':
      case 'unitWithVariableVolume': {
        if (value < 1 && value > 0) {
          return `${format(value * 1000)}${spacer}mL`;
        }

        return `${format(value)}${spacer}L`;
      }
      case 'weight':
      case 'unitWithFixedWeight':
      case 'unitWithVariableWeight': {
        if (value < 1 && value > 0) {
          return `${format(value * 1000)}${spacer}g`;
        }

        return `${format(value)}${spacer}kg`;
      }
      case 'unit':
      default:
        return format(value);
    }
  }
}
