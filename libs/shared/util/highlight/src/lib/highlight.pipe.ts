import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { latinize } from '@plastik/shared/latinize';
import { escapeHtml } from '@plastik/shared/objects';

/** Maximum number of entries in the normalized search cache to prevent memory leaks. */
const MAX_CACHE_SIZE = 50;
/** Map cache for normalized search terms (`latinize` + `toLowerCase`). */
const NORMALIZED_SEARCH_CACHE = new Map<string, string>();

/**
 * @description Returns the normalized search string.
 * @param {string} search The search term to normalize.
 * @returns {string} The normalized search string.
 */
function getNormalizedSearch(search: string): string {
  let normalized = NORMALIZED_SEARCH_CACHE.get(search);
  if (normalized === undefined) {
    if (NORMALIZED_SEARCH_CACHE.size >= MAX_CACHE_SIZE) {
      NORMALIZED_SEARCH_CACHE.clear();
    }
    normalized = latinize(search).toLowerCase();
    NORMALIZED_SEARCH_CACHE.set(search, normalized);
  }
  return normalized;
}

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  readonly #sanitizer: DomSanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined, search: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }

    if (!search || !search.trim()) {
      return escapeHtml(value);
    }

    const normalizedValue = latinize(value).toLowerCase();
    // PERFORMANCE OPTIMIZATION: Cache normalized search term across table rows / list items
    // to avoid re-running latinize() and string allocations per rendered item.
    const normalizedSearch = getNormalizedSearch(search);

    const startIdx = normalizedValue.indexOf(normalizedSearch);

    if (startIdx === -1) {
      return escapeHtml(value);
    }

    // Use original case from the value for the highlighted part
    const highlighted = value.substring(startIdx, startIdx + normalizedSearch.length);
    const result =
      escapeHtml(value.substring(0, startIdx)) +
      `<mark class="bg-warning-200 dark:bg-warning-800 text-on-surface px-0.5 rounded-sm">${escapeHtml(
        highlighted
      )}</mark>` +
      escapeHtml(value.substring(startIdx + normalizedSearch.length));

    return this.#sanitizer.bypassSecurityTrustHtml(result);
  }
}
