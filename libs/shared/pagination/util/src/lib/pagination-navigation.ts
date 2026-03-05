import { inject, Directive, input } from '@angular/core';
import { Router, type QueryParamsHandling } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { PaginationComponent } from '@plastik/pagination/ui';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive()
export abstract class PaginationNavigationDirective<P extends object> {
  /**
   * How to handle existing query parameters when navigating.
   * Defaults to 'merge' to preserve existing params.
   */
  queryParamsHandling = input<QueryParamsHandling>('merge');
  protected readonly router = inject(Router);
  protected readonly paginator = inject(PaginationComponent, { host: true });

  constructor() {
    outputToObservable(this.paginator.pageChange)
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.navigateToPage(event));
  }

  private navigateToPage(event: PageEvent): void {
    const queryParams: P = this.getPaginationParams(event);

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: this.queryParamsHandling(),
    });
  }

  /**
   * The only thing the child must do: transform the event into type P.
   * Must be 'protected' to be accessible from the parent.
   */
  protected abstract getPaginationParams(event: PageEvent): P;
}
