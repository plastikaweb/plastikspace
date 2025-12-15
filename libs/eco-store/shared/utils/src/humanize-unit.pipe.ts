import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductUnitType } from '@plastik/eco-store/entities';

@Pipe({
  name: 'humanizeUnit',
  standalone: true,
})
export class HumanizeUnitPipe implements PipeTransform {
  translate = inject(TranslateService);

  transform(value: number | null | undefined, unitType: ProductUnitType): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '';

    const lang = this.translate.getCurrentLang?.();
    // avoid unwanted line break
    const spacer = '\u00A0';

    const format = (n: number) =>
      new Intl.NumberFormat(lang, {
        maximumFractionDigits: 2,
        minimumFractionDigits: n % 1 === 0 ? 0 : 2,
      }).format(n);

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
