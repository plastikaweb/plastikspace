import { Pipe, PipeTransform } from '@angular/core';

type HexColor = `#${string}`;
type RgbComponent = number;
type AlphaValue = number;
type RgbaColor = `rgba(${RgbComponent}, ${RgbComponent}, ${RgbComponent}, ${AlphaValue})`;

/** Regular expression to validate a 6-character hexadecimal color string. */
const HEX_REGEX = /^[0-9a-fA-F]{6}$/;

@Pipe({
  name: 'hexToRgba',
})
export class HexToRgbaPipe implements PipeTransform {
  readonly #cache = new Map<string, RgbaColor>();

  /**
   * Converts a hexadecimal color to RGBA format with caching and optimized parsing.
   * @param {HexColor} value - The hexadecimal color starting with '#'.
   * @param {number} alpha - The alpha transparency value (0 to 1).
   * @returns {RgbaColor} The formatted RGBA color string.
   */
  transform(value: HexColor, alpha: number): RgbaColor {
    const cacheKey = `${value}_${alpha}`;
    const cached = this.#cache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    if (alpha < 0 || alpha > 1) {
      throw new Error('Alpha value must be between 0 and 1');
    }

    const hex = value.slice(1);

    if (hex.length !== 6 || !HEX_REGEX.test(hex)) {
      throw new Error('Invalid hex color format');
    }

    // High-performance single-pass integer parsing & bitwise extraction (zero substring allocations)
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const result = `rgba(${r}, ${g}, ${b}, ${alpha})` as RgbaColor;
    this.#cache.set(cacheKey, result);
    return result;
  }
}
