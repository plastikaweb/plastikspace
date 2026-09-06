import { Pipe, PipeTransform } from '@angular/core';

type HexColor = `#${string}`;
type RgbComponent = number;
type AlphaValue = number;
type RgbaColor = `rgba(${RgbComponent}, ${RgbComponent}, ${RgbComponent}, ${AlphaValue})`;

/** Module-level cache for converted RGBA color strings to eliminate redundant conversions. */
const HEX_TO_RGBA_CACHE = new Map<string, RgbaColor>();
const HEX_6_CHAR_REGEX = /^[0-9a-fA-F]{6}$/;

@Pipe({
  name: 'hexToRgba',
})
export class HexToRgbaPipe implements PipeTransform {
  transform(value: HexColor, alpha: number): RgbaColor {
    if (alpha < 0 || alpha > 1) {
      throw new Error('Alpha value must be between 0 and 1');
    }

    const cacheKey = `${value}_${alpha}`;
    const cachedResult = HEX_TO_RGBA_CACHE.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    if (!value || value.length !== 7 || value[0] !== '#') {
      throw new Error('Invalid hex color format');
    }

    const hex = value.slice(1);
    if (!HEX_6_CHAR_REGEX.test(hex)) {
      throw new Error('Invalid hex color format');
    }

    // Optimization: Parse full hex integer once and use bitwise shift/masking
    // instead of multiple string slicing and repeated parseInt calls.
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const result: RgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    HEX_TO_RGBA_CACHE.set(cacheKey, result);

    return result;
  }
}
