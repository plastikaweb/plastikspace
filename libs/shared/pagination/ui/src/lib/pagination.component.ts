import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'plastik-pagination',
  imports: [MatPaginatorModule],
  template: `
    <mat-paginator
      [length]="count()"
      [pageSize]="pageSize()"
      [pageIndex]="pageIndex()"
      [pageSizeOptions]="pageSizeOptions()"
      [showFirstLastButtons]="showFirstLastButtons()"
      (page)="pageChange.emit($event)" />
  `,
  styleUrl: './pagination.component.scss',
  host: {
    class: 'block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  /*
   * Current page size (provided by directive)
   */
  pageSize = input.required<number>();

  /**
   * Current page index - 0-indexed for Material Paginator (provided by directive)
   */
  pageIndex = input.required<number>();

  /**
   * Total number of items
   */
  count = input.required<number>();

  /**
   * Show first and last buttons
   */
  showFirstLastButtons = input<boolean>(false);

  /**
   * Available page size options
   */
  pageSizeOptions = input.required<number[]>();

  /**
   * Emitted when pagination changes - Material's PageEvent (0-indexed)
   */
  pageChange = output<PageEvent>();
}
