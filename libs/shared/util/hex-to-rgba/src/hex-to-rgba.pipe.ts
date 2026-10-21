import { Pipe, PipeTransform } from '@angular/core';

type HexColor = `#${string}`;
type RgbComponent = number;
type AlphaValue = number;
type RgbaColor = `rgba(${RgbComponent}, ${RgbComponent}, ${RgbComponent}, ${AlphaValue})`;

/** Maximum capacity of the bounded hex-to-rgba transformation cache. */
const MAX_CACHE_SIZE = 500;

/** Bounded cache mapping `${hexColor}_${alpha}` to precomputed `RgbaColor` strings. */
const HEX_TO_RGBA_CACHE = new Map<string, RgbaColor>();

/**
 * Pipe that converts a hex color string and alpha transparency value into an RGBA CSS string.
 * Employs a bounded Map cache to optimize repeated transforms in component templates and lists.
 */
@Pipe({
  name: 'hexToRgba',
})
export class HexToRgbaPipe implements PipeTransform {
  /**
   * Transforms a hex color string and alpha value into an `rgba(r, g, b, alpha)` string representation.
   * @param {HexColor} value - The hex color string starting with `#`.
   * @param {number} alpha - The alpha transparency value between 0 and 1.
   * @returns {RgbaColor} The formatted RGBA color string.
   */
  transform(value: HexColor, alpha: number): RgbaColor {
    const cacheKey = `${value}_${alpha}`;
    const cached = HEX_TO_RGBA_CACHE.get(cacheKey);

    if (cached !== undefined) {
      return cached;
    }

    const hex = value.slice(1);

    if (hex.length !== 6) {
      throw new Error('Invalid hex color format');
    }

    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);

    if (isNaN(red) || isNaN(green) || isNaN(blue)) {
      throw new Error('Invalid hex color format');
    }

    if (red < 0 || red > 255 || green < 0 || green > 255 || blue < 0 || blue > 255) {
      throw new Error('RGB values must be between 0 and 255');
    }

    if (alpha < 0 || alpha > 1) {
      throw new Error('Alpha value must be between 0 and 1');
    }

    const result: RgbaColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

    if (HEX_TO_RGBA_CACHE.size >= MAX_CACHE_SIZE) {
      const firstKey = HEX_TO_RGBA_CACHE.keys().next().value;

      if (firstKey !== undefined) {
        HEX_TO_RGBA_CACHE.delete(firstKey);
      }
    }

    HEX_TO_RGBA_CACHE.set(cacheKey, result);

    return result;
  }
}
