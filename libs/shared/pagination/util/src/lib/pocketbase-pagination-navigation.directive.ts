import { Directive, input } from '@angular/core';
import { BasePocketBaseEntityPagination } from '@plastik/core/entities';
import { PageEvent } from '@angular/material/paginator';
import { PaginationNavigationDirective } from './pagination-navigation';
import { QueryParamsHandling } from '@angular/router';
import { fromTablePagination } from '@plastik/shared/table/util';

@Directive({
  selector: '[plastikPocketbasePaginationNavigation]',
})
export class PocketbasePaginationNavigationDirective extends PaginationNavigationDirective<BasePocketBaseEntityPagination> {
  // Required inputs for calculation (if extra logic is needed)
  readonly pageSize = input.required<number>();

  // Optional input for queryParamsHandling with query-params-handling alias
  override readonly queryParamsHandling = input<QueryParamsHandling, QueryParamsHandling | ''>(
    'merge',
    {
      alias: 'plastikPocketbasePaginationNavigation',
      transform: (value: QueryParamsHandling | '') => (value === '' ? 'merge' : value),
    }
  );

  // Mandatory implementation.
  // TypeScript automatically verifies that the return is BasePocketBaseEntityPagination
  protected getPaginationParams(event: PageEvent): BasePocketBaseEntityPagination {
    return fromTablePagination(event, this.pageSize());
  }
}
