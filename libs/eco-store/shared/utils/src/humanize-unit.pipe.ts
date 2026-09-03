import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductUnitType } from '@plastik/eco-store/entities';

/**
 * Module-level cache for `Intl.NumberFormat` instances keyed by language and fraction digit options.
 * Prevents redundant `Intl.NumberFormat` object instantiations across repeated pipe transformations.
 */
const NUMBER_FORMATTER_CACHE = new Map<string, Intl.NumberFormat>();

/**
 * Helper to retrieve or create a cached `Intl.NumberFormat` instance.
 * @param {string | undefined} lang The language code for formatting.
 * @param {number} minimumFractionDigits The minimum number of fraction digits.
 * @param {number} maximumFractionDigits The maximum number of fraction digits.
 * @returns {Intl.NumberFormat} The cached or newly created Intl.NumberFormat instance.
 */
function getNumberFormatter(
  lang: string | undefined,
  minimumFractionDigits: number,
  maximumFractionDigits: number
): Intl.NumberFormat {
  const cacheKey = `${lang || 'default'}_${minimumFractionDigits}_${maximumFractionDigits}`;
  let formatter = NUMBER_FORMATTER_CACHE.get(cacheKey);

  if (!formatter) {
    formatter = new Intl.NumberFormat(lang, {
      minimumFractionDigits,
      maximumFractionDigits,
    });
    NUMBER_FORMATTER_CACHE.set(cacheKey, formatter);
  }

  return formatter;
}

@Pipe({
  name: 'humanizeUnit',
})
export class HumanizeUnitPipe implements PipeTransform {
  translate = inject(TranslateService);

  transform(value: number | null | undefined, unitType: ProductUnitType): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '';

    const lang = this.translate.getCurrentLang?.();
    // avoid unwanted line break
    const spacer = '\u00A0';

    const format = (num: number) => {
      const minFractionDigits = num % 1 === 0 ? 0 : 2;

      return getNumberFormatter(lang, minFractionDigits, 2).format(num);
    };

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
