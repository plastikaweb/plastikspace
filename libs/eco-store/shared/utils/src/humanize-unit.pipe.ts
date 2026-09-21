import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductUnitType } from '@plastik/eco-store/entities';

const FORMATTER_CACHE = new Map<string, Intl.NumberFormat>();

/**
 * Returns a cached Intl.NumberFormat instance for the given language and minimum fraction digits.
 * @param {string | undefined} lang The current language code.
 * @param {number} minFractionDigits The minimum number of fraction digits.
 * @returns {Intl.NumberFormat} The cached Intl.NumberFormat instance.
 */
function getFormatter(lang: string | undefined, minFractionDigits: number): Intl.NumberFormat {
  const key = `${lang || ''}_${minFractionDigits}`;
  let formatter = FORMATTER_CACHE.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat(lang, {
      maximumFractionDigits: 2,
      minimumFractionDigits: minFractionDigits,
    });
    FORMATTER_CACHE.set(key, formatter);
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

    const format = (numValue: number) => {
      const minFractionDigits = numValue % 1 === 0 ? 0 : 2;

      return getFormatter(lang, minFractionDigits).format(numValue);
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
