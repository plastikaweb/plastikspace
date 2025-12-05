import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MatPaginatorIntlService extends MatPaginatorIntl {
  readonly #translateService = inject(TranslateService);
  readonly #destroyRef = inject(DestroyRef);

  constructor() {
    super();

    this.#updateLabels();

    this.#translateService.onLangChange.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.#updateLabels();
      this.changes.next();
    });
  }

  #updateLabels(): void {
    this.itemsPerPageLabel = this.#translateService.instant('paginator.items-per-page');
    this.nextPageLabel = this.#translateService.instant('paginator.next-page');
    this.previousPageLabel = this.#translateService.instant('paginator.previous-page');
    this.firstPageLabel = this.#translateService.instant('paginator.first-page');
    this.lastPageLabel = this.#translateService.instant('paginator.last-page');

    this.getRangeLabel = (page: number, pageSize: number, length: number): string => {
      if (length === 0 || pageSize === 0) {
        return this.#translateService.instant('paginator.no-items', { length });
      }

      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

      return this.#translateService.instant('paginator.range', {
        start: startIndex + 1,
        end: endIndex,
        total: length,
      });
    };
  }
}
