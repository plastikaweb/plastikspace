import { Pipe, PipeTransform } from '@angular/core';

/** Cached `Math.log(1024)` — avoids recomputing the divisor on every transform. */
const LOG1024 = Math.log(1024);
/** Precomputed powers of 1024 for the common Bytes…TB tiers (index = unit exponent). */
const POWERS = [1, 1024, 1024 ** 2, 1024 ** 3, 1024 ** 4];
/** Module-level constant array for size unit labels to avoid per-instance object creation. */
const SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

/**
 * Pipe to convert a byte count into a human-readable size string.
 */
@Pipe({
  name: 'bytesToSize',
})
export class BytesToSizePipe implements PipeTransform {
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
    // Performance fast-path: byte values less than 1024 are directly formatted without logarithmic operations.
    if (value < 1024) {
      return `${value} ${SIZES[0]}`;
    }

    // Determine unit index via logarithmic tiering, bounded to the max available SIZES label.
    const rawSize = Math.floor(Math.log(value) / LOG1024);
    const size = Math.min(rawSize, SIZES.length - 1);
    const power = POWERS[size] ?? 1024 ** size;

    return `${(value / power).toFixed(fixed)} ${SIZES[size]}`;
  }
}
