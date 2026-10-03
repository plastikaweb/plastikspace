import { Pipe, PipeTransform } from '@angular/core';

type HexColor = `#${string}`;
type RgbComponent = number;
type AlphaValue = number;
type RgbaColor = `rgba(${RgbComponent}, ${RgbComponent}, ${RgbComponent}, ${AlphaValue})`;

/** Maximum entries allowed in the hexToRgba transformation cache. */
const MAX_CACHE_SIZE = 500;
/** Bounded module-level cache for converted RGBA strings to avoid repeated parsing and string allocations. */
const HEX_TO_RGBA_CACHE = new Map<string, RgbaColor>();

@Pipe({
  name: 'hexToRgba',
})
export class HexToRgbaPipe implements PipeTransform {
  /**
   * Transforms a 6-character hex color code and alpha value to an RGBA color string.
   * Uses a bounded module-level cache to eliminate repetitive string slicing,
   * `parseInt` parsing, validation checks, and template string allocations across template evaluation passes.
   */
  transform(value: HexColor, alpha: number): RgbaColor {
    const cacheKey = `${value}:${alpha}`;
    const cached = HEX_TO_RGBA_CACHE.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const hex = value.slice(1);

    if (hex.length !== 6) {
      throw new Error('Invalid hex color format');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      throw new Error('Invalid hex color format');
    }

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error('RGB values must be between 0 and 255');
    }

    if (alpha < 0 || alpha > 1) {
      throw new Error('Alpha value must be between 0 and 1');
    }

    const rgbaResult: RgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;

    if (HEX_TO_RGBA_CACHE.size >= MAX_CACHE_SIZE) {
      HEX_TO_RGBA_CACHE.clear();
    }
    HEX_TO_RGBA_CACHE.set(cacheKey, rgbaResult);

    return rgbaResult;
  }
}
