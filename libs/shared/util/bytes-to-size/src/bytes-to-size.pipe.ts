import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytesToSize',
})
export class BytesToSizePipe implements PipeTransform {
  sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  /**
   * Converts a number representing bytes to a human-readable size format.
   * @param value - The number of bytes to be converted.
   * @param fixed - The number of decimal places to round the converted size to (default: 0).
   * @returns A string representing the converted size in a human-readable format.
   */
  transform(value: number, fixed = 0): string {
    if (!value) {
      return 'n/a';
    }
    const size = parseInt(String(Math.floor(Math.log(value) / Math.log(1024))), 10);
    if (size === 0) {
      return `${value} ${this.sizes[size]}`;
    }
    return `${(value / 1024 ** size).toFixed(fixed)} ${this.sizes[size]}`;
  }
}
