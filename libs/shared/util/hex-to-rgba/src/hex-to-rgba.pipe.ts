import { Pipe, PipeTransform } from '@angular/core';

type HexColor = `#${string}`;
type RgbComponent = number;
type AlphaValue = number;
type RgbaColor = `rgba(${RgbComponent}, ${RgbComponent}, ${RgbComponent}, ${AlphaValue})`;

@Pipe({
  name: 'hexToRgba',
})
export class HexToRgbaPipe implements PipeTransform {
  transform(value: HexColor, alpha: number): RgbaColor {
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

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
