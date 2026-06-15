import { Pipe, PipeTransform } from '@angular/core';

const LOG1024 = Math.log(1024);
const POWERS = [1, 1024, 1024 ** 2, 1024 ** 3, 1024 ** 4];

/**
 * Pipe to convert a byte count into a human-readable size string.
 */
@Pipe({
  name: 'bytesToSize',
})
export class BytesToSizePipe implements PipeTransform {
  readonly #sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  /**
   * Converts a number representing bytes to a human-readable size format.
   * @param {number} value - The number of bytes to be converted.
   * @param {number} fixed - The number of decimal places to round the converted size to (default: 0).
   * @returns {string} A string representing the converted size in a human-readable format.
   */
  transform(value: number, fixed = 0): string {
    if (value === null || value === undefined || isNaN(value)) {
      return 'n/a';
    }
    if (value === 0) {
      return `0 ${this.#sizes[0]}`;
    }
    // Optimization: Cache LOG1024 and avoid redundant string conversion
    const size = Math.floor(Math.log(value) / LOG1024);
    if (size === 0) {
      return `${value} ${this.#sizes[size]}`;
    }
    // Optimization: Use precomputed powers of 1024
    const power = POWERS[size] ?? Math.pow(1024, size);
    return `${(value / power).toFixed(fixed)} ${this.#sizes[size]}`;
  }
}
