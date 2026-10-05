import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { latinize } from '@plastik/shared/latinize';
import { escapeHtml } from '@plastik/shared/objects';

/** Maximum number of entries stored in the LRU highlight cache. */
export const MAX_HIGHLIGHT_CACHE_SIZE = 500;

/**
 * Module-level bounded LRU cache mapping `value\0search` pairs to pre-computed SafeHtml/string results.
 */
export const HIGHLIGHT_CACHE = new Map<string, SafeHtml>();

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

    const cacheKey = `${value}\0${search}`;
    const cached = HIGHLIGHT_CACHE.get(cacheKey);
    if (cached !== undefined) {
      // Refresh key for LRU eviction policy
      HIGHLIGHT_CACHE.delete(cacheKey);
      HIGHLIGHT_CACHE.set(cacheKey, cached);
      return cached;
    }

    const normalizedValue = latinize(value).toLowerCase();
    const normalizedSearch = latinize(search).toLowerCase();

    const startIdx = normalizedValue.indexOf(normalizedSearch);

    if (startIdx === -1) {
      const escapedValue = escapeHtml(value);
      this.#setCache(cacheKey, escapedValue);
      return escapedValue;
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
    this.#setCache(cacheKey, safeResult);
    return safeResult;
  }

  #setCache(key: string, value: SafeHtml): void {
    if (HIGHLIGHT_CACHE.size >= MAX_HIGHLIGHT_CACHE_SIZE) {
      const oldestKey = HIGHLIGHT_CACHE.keys().next().value;
      if (oldestKey !== undefined) {
        HIGHLIGHT_CACHE.delete(oldestKey);
      }
    }
    HIGHLIGHT_CACHE.set(key, value);
  }
}
