import { Directive, input } from '@angular/core';
import { BasePocketBaseEntityPagination } from '@plastik/core/entities';
import { PageEvent } from '@angular/material/paginator';
import { PaginationNavigationDirective } from './pagination-navigation';
import { QueryParamsHandling } from '@angular/router';

@Directive({
  selector: '[plastikPocketbasePaginationNavigation]',
})
export class PocketbasePaginationNavigationDirective extends PaginationNavigationDirective<BasePocketBaseEntityPagination> {
  // Required inputs for calculation (if extra logic is needed)
  pageSize = input.required<number>();

  // Optional input for queryParamsHandling with query-params-handling alias
  override queryParamsHandling = input<QueryParamsHandling>('merge', {
    alias: 'plastikPocketbasePaginationNavigation',
  });

  // Mandatory implementation.
  // TypeScript automatically verifies that the return is BasePocketBaseEntityPagination
  protected getPaginationParams(event: PageEvent): BasePocketBaseEntityPagination {
    const isPageSizeChange = this.pageSize() !== event.pageSize;

    return {
      perPage: Math.max(event.pageSize, 1),
      // PocketBase specific logic (1-indexed)
      page: Math.max(isPageSizeChange ? 1 : event.pageIndex + 1, 1),
    };
  }
}
