import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { latinize } from '@plastik/shared/latinize';
import { escapeHtml } from '@plastik/shared/objects';

/** Maximum capacity for internal caches to avoid unbounded memory growth. */
const MAX_CACHE_SIZE = 500;

/** Bounded cache for latinized lowercased strings to avoid repeated regex allocations. */
const LATIN_LOWER_CACHE = new Map<string, string>();

/** Bounded cache for highlighted transform results keyed by value and search terms. */
const HIGHLIGHT_RESULT_CACHE = new Map<string, SafeHtml>();

/**
 * Normalizes a string by converting latin characters and lowercasing with caching.
 * @param {string} text - The input string to normalize.
 * @returns {string} The normalized string.
 */
function getNormalized(text: string): string {
  let cached = LATIN_LOWER_CACHE.get(text);

  if (cached === undefined) {
    if (LATIN_LOWER_CACHE.size >= MAX_CACHE_SIZE) {
      LATIN_LOWER_CACHE.clear();
    }

    cached = latinize(text).toLowerCase();
    LATIN_LOWER_CACHE.set(text, cached);
  }

  return cached;
}

/**
 * Pipe to highlight matching search substrings within a text string.
 */
@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  readonly #sanitizer: DomSanitizer = inject(DomSanitizer);

  /**
   * Highlights occurrences of `search` within `value` using a `<mark>` tag.
   * Caches result computations to optimize table renders and list filtering.
   * @param {string | null | undefined} value - The input text to format and highlight.
   * @param {string | null | undefined} search - The query term to search for.
   * @returns {SafeHtml} The HTML output with highlighted matches or escaped original text.
   */
  transform(value: string | null | undefined, search: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }

    if (!search || !search.trim()) {
      return escapeHtml(value);
    }

    const cacheKey = `${value}\0${search}`;
    const cachedResult = HIGHLIGHT_RESULT_CACHE.get(cacheKey);

    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const normalizedValue = getNormalized(value);
    const normalizedSearch = getNormalized(search);

    const startIdx = normalizedValue.indexOf(normalizedSearch);

    if (startIdx === -1) {
      const escaped = escapeHtml(value);

      if (HIGHLIGHT_RESULT_CACHE.size >= MAX_CACHE_SIZE) {
        HIGHLIGHT_RESULT_CACHE.clear();
      }

      HIGHLIGHT_RESULT_CACHE.set(cacheKey, escaped);

      return escaped;
    }

    // Use original case from the value for the highlighted part
    const highlighted = value.substring(startIdx, startIdx + normalizedSearch.length);
    const result =
      escapeHtml(value.substring(0, startIdx)) +
      `<mark class="bg-warning-200 dark:bg-warning-800 text-on-surface px-0.5 rounded-sm">${escapeHtml(
        highlighted
      )}</mark>` +
      escapeHtml(value.substring(startIdx + normalizedSearch.length));

    const safeResult = this.#sanitizer.bypassSecurityTrustHtml(result);

    if (HIGHLIGHT_RESULT_CACHE.size >= MAX_CACHE_SIZE) {
      HIGHLIGHT_RESULT_CACHE.clear();
    }

    HIGHLIGHT_RESULT_CACHE.set(cacheKey, safeResult);

    return safeResult;
  }
}
