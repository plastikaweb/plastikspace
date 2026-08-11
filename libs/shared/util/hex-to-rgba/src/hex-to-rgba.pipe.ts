import { Pipe, PipeTransform } from '@angular/core';

type HexColor = `#${string}`;
type RgbComponent = number;
type AlphaValue = number;
type RgbaColor = `rgba(${RgbComponent}, ${RgbComponent}, ${RgbComponent}, ${AlphaValue})`;

@Pipe({
  name: 'hexToRgba',
})
export class HexToRgbaPipe implements PipeTransform {
  // Memoization cache mapping `hexColor_alphaValue` to `rgba(...)` string
  readonly #cache = new Map<string, RgbaColor>();

  transform(value: HexColor, alpha: number): RgbaColor {
    const cacheKey = `${value}_${alpha}`;
    const cached = this.#cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    if (alpha < 0 || alpha > 1) {
      throw new Error('Alpha value must be between 0 and 1');
    }

    const hex = value.slice(1);
    // RegExp fast-path validation: verifies both character characters and string length in one pass
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      throw new Error('Invalid hex color format');
    }

    // Extract RGB components using bitwise shift-and-mask on a single parsed integer
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const result: RgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    this.#cache.set(cacheKey, result);
    return result;
  }
}
