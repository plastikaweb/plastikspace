import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { latinize } from '@plastik/shared/latinize';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  readonly #sanitizer: DomSanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined, search: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }

    const escapedValue = this.#escapeHtml(value);

    if (!search || !search.trim()) {
      return escapedValue;
    }

    const escapedSearch = this.#escapeHtml(search);
    const normalizedValue = latinize(escapedValue).toLowerCase();
    const normalizedSearch = latinize(escapedSearch).toLowerCase();

    const startIdx = normalizedValue.indexOf(normalizedSearch);

    if (startIdx === -1) {
      return escapedValue;
    }

    // Use original case from the value for the highlighted part
    const highlighted = escapedValue.substring(startIdx, startIdx + normalizedSearch.length);
    const result =
      escapedValue.substring(0, startIdx) +
      `<mark class="bg-warning-200 dark:bg-warning-800 text-on-surface px-0.5 rounded-sm">${highlighted}</mark>` +
      escapedValue.substring(startIdx + normalizedSearch.length);

    return this.#sanitizer.bypassSecurityTrustHtml(result);
  }

  #escapeHtml(text: string): string {
    const lookup: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return text.replace(/[&<>"'/]/g, char => lookup[char]);
  }
}
