import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductUnitType } from '@plastik/eco-store/entities';

/**
 * Bounded module-level cache for Intl.NumberFormat instances per language and precision.
 */
const NUMBER_FORMATTER_CACHE = new Map<string, Intl.NumberFormat>();

/**
 * @description Retrieves or creates a cached Intl.NumberFormat instance for a given language and minimumFractionDigits.
 * @param {string | undefined} lang Current language code.
 * @param {number} minimumFractionDigits Minimum fraction digits formatting option.
 * @returns {Intl.NumberFormat} Formatter instance.
 */
function getNumberFormatter(
  lang: string | undefined,
  minimumFractionDigits: number
): Intl.NumberFormat {
  const cacheKey = `${lang}_${minimumFractionDigits}`;
  let formatter = NUMBER_FORMATTER_CACHE.get(cacheKey);

  if (!formatter) {
    formatter = new Intl.NumberFormat(lang, {
      maximumFractionDigits: 2,
      minimumFractionDigits,
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

    const format = (num: number) =>
      getNumberFormatter(lang, num % 1 === 0 ? 0 : 2).format(num);

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
