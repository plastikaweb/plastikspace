import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { latinize } from '@plastik/shared/latinize';
import { escapeHtml } from '@plastik/shared/objects';

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
    const normalizedSearch = latinize(search).toLowerCase();

    const startIdx = normalizedValue.indexOf(normalizedSearch);

    if (startIdx === -1) {
      return escapeHtml(value);
    }

    const searchLen = normalizedSearch.length;
    const endIdx = startIdx + searchLen;

    // Fast HTML escaping and template string construction
    const before = escapeHtml(value.substring(0, startIdx));
    const highlighted = escapeHtml(value.substring(startIdx, endIdx));
    const after = escapeHtml(value.substring(endIdx));

    return this.#sanitizer.bypassSecurityTrustHtml(
      `${before}<mark class="bg-warning-200 dark:bg-warning-800 text-on-surface px-0.5 rounded-sm">${highlighted}</mark>${after}`
    );
  }
}
