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

    if (!search || !search.trim()) {
      return value;
    }

    const normalizedValue = latinize(value).toLowerCase();
    const normalizedSearch = latinize(search).toLowerCase();

    const startIdx = normalizedValue.indexOf(normalizedSearch);

    if (startIdx === -1) {
      return value;
    }

    // Use original case from the value for the highlighted part
    const highlighted = value.substring(startIdx, startIdx + normalizedSearch.length);
    const result =
      value.substring(0, startIdx) +
      `<mark class="bg-warning-200 dark:bg-warning-800 text-on-surface px-0.5 rounded-sm">${highlighted}</mark>` +
      value.substring(startIdx + normalizedSearch.length);

    return this.#sanitizer.bypassSecurityTrustHtml(result);
  }
}
