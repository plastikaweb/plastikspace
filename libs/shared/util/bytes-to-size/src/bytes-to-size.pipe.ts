import { Pipe, PipeTransform } from '@angular/core';

/** Fast-path Byte unit thresholds (powers of 1024). */
const KB = 1024;
const MB = 1024 ** 2;
const GB = 1024 ** 3;
const TB = 1024 ** 4;

/** Cached `Math.log(1024)` — fallback divisor for sizes >= PB. */
const LOG1024 = Math.log(1024);
/** Precomputed powers of 1024 for index-based logarithmic fallback. */
const POWERS = [1, KB, MB, GB, TB];

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

    // Fast-path: Direct numeric comparisons bypass expensive Math.log calls for standard file sizes.
    if (value < KB) {
      return `${value} ${this.#sizes[0]}`;
    }
    if (value < MB) {
      return `${(value / KB).toFixed(fixed)} ${this.#sizes[1]}`;
    }
    if (value < GB) {
      return `${(value / MB).toFixed(fixed)} ${this.#sizes[2]}`;
    }
    if (value < TB) {
      return `${(value / GB).toFixed(fixed)} ${this.#sizes[3]}`;
    }

    // Logarithmic fallback for extreme file sizes (>= 1 TB).
    const size = Math.floor(Math.log(value) / LOG1024);
    const power = POWERS[size] ?? 1024 ** size;
    const unit = this.#sizes[size] ?? 'TB';
    return `${(value / power).toFixed(fixed)} ${unit}`;
  }
}
