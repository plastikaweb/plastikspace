import { Pipe, PipeTransform } from '@angular/core';

type HexColor = `#${string}`;
type RgbComponent = number;
type AlphaValue = number;
type RgbaColor = `rgba(${RgbComponent}, ${RgbComponent}, ${RgbComponent}, ${AlphaValue})`;

/** Module-level cache for transformed HEX to RGBA string results to eliminate repeated parsing overhead */
const HEX_COLOR_CACHE = new Map<string, RgbaColor>();

/** Pre-compiled regex for validating hex string formats */
const HEX_FORMAT_REGEX = /^[0-9a-fA-F]{6}$/;

/**
 * Pipe that converts a hex color string (e.g. `#00FF00`) and an alpha transparency value (0-1) into an `rgba(...)` string.
 */
@Pipe({
  name: 'hexToRgba',
})
export class HexToRgbaPipe implements PipeTransform {
  /**
   * Transforms a hex color and alpha value into an `rgba(...)` formatted string.
   * Caches results and uses bitwise shifting for fast RGB parsing.
   * @param {HexColor} value - Hexadecimal color string starting with `#`.
   * @param {number} alpha - Alpha transparency value between 0 and 1.
   * @returns {RgbaColor} Formatted RGBA color string.
   */
  transform(value: HexColor, alpha: number): RgbaColor {
    if (alpha < 0 || alpha > 1) {
      throw new Error('Alpha value must be between 0 and 1');
    }

    const cacheKey = `${value}_${alpha}`;
    const cached = HEX_COLOR_CACHE.get(cacheKey);

    if (cached !== undefined) {
      return cached;
    }

    const hex = value ? value.slice(1) : '';

    if (hex.length !== 6 || !HEX_FORMAT_REGEX.test(hex)) {
      throw new Error('Invalid hex color format');
    }

    const num = parseInt(hex, 16);
    const redComponent = (num >> 16) & 255;
    const greenComponent = (num >> 8) & 255;
    const blueComponent = num & 255;

    const result =
      `rgba(${redComponent}, ${greenComponent}, ${blueComponent}, ${alpha})` as RgbaColor;

    HEX_COLOR_CACHE.set(cacheKey, result);

    return result;
  }
}
