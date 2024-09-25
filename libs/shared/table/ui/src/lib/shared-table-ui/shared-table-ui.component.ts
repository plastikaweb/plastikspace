import { CdkTableModule } from '@angular/cdk/table';
import { KeyValuePipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { BaseEntity } from '@plastik/core/entities';
import { FormattingTypes, SharedUtilFormattersModule } from '@plastik/shared/formatters';
import {
  PageEventConfig,
  TableColumnFormatting,
  TableControlAction,
  TablePaginationVisibility,
  TableSorting,
  TableSortingConfig,
} from '@plastik/shared/table/entities';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { OrderTableActionsElementsPipe } from '../utils/order-table-actions-elements.pipe';
import { TableCellTitleDirective } from '../utils/table-cell-title.directive';

@Component({
  selector: 'plastik-shared-table',
  standalone: true,
  imports: [
    PushPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CdkTableModule,
    MatTooltipModule,
    MatIconModule,
    RouterModule,
    AngularSvgIconModule,
    SharedUtilFormattersModule,
    TableCellTitleDirective,
    OrderTableActionsElementsPipe,
    KeyValuePipe,
    NgClass,
  ],
  templateUrl: './shared-table-ui.component.html',
  styleUrls: ['./shared-table-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTableUiComponent<T extends BaseEntity> implements OnChanges, AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  /**
   * Data that will populate the table.
   */
  @Input() data: T[] = [];

  /**
   * Table columns structure.
   */
  @Input() columnProperties!: TableColumnFormatting<T, FormattingTypes>[];

  /**
   * The total number of items available for the current table data request.
   * Used for pagination and to show the total number of items.
   */
  @Input() resultsLength?: number;

  /**
   * Pagination configuration.
   */
  @Input() pagination?: PageEventConfig;

  /**
   * Remove pagination component to the table. Present by default.
   */
  @Input() noPagination = false;

  /**
   * Sets the pagination elements visibility configuration.
   */
  @Input() paginationVisibility?: Partial<TablePaginationVisibility> = {
    hidePageSize: false,
    hidePaginationFirstLastButtons: false,
    hideRangeButtons: false,
    hideRangeLabel: false,
  };

  /**
   * Page sizes available.
   * array with the number of items per page.
   */
  @Input() pageSizeOptions!: number[];

  /**
   * Main title of the table.
   */
  @Input() caption!: string;

  /**
   * Table sorting configuration.
   */
  @Input() sort?: TableSortingConfig;

  /**
   * Table actions configuration.
   */
  @Input() actions?: TableControlAction<T>;

  @Input() filterCriteria = '';

  @Input() extraRowStyles?: (element: T) => string;

  /**
   * An Output emitter to send table pagination changes.
   */
  @Output()
  changePagination: EventEmitter<PageEventConfig> = new EventEmitter();

  /**
   * An Output emitter to send table sorting changes.
   */
  @Output()
  changeSorting = new EventEmitter<TableSorting>();

  /**
   * An Output emitter to send table delete action.
   */
  @Output()
  delete = new EventEmitter<T>();

  @ViewChild(MatTable) matTable!: MatTable<T>;
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort?: MatSort;

  dataSource = new MatTableDataSource();
  displayedColumns: (string | number | symbol)[] = [];

  ngAfterViewInit() {
    this.displayedColumns = this?.columnProperties?.map(property => property.key) || [];

    if (this.actions) {
      this.displayedColumns.push('actions');
      this.cdr.detectChanges();
    }

    if (this.matPaginator && this.pagination) {
      this.matPaginator.pageIndex = this.pagination?.pageIndex || 0;
      this.matPaginator.pageSize = this.pagination?.pageSize || 10;
    }

    if (this.matSort) {
      this.matSort.active = this.sort?.[0] || '';
      this.matSort.direction = this.sort?.[1] || 'asc';
      this.dataSource.sort = this.matSort;
    }
  }

  ngOnChanges({
    data,
    resultsLength,
    pagination,
    sort,
    columnProperties,
    filterCriteria,
  }: SimpleChanges) {
    if (columnProperties) {
      this.displayedColumns = this?.columnProperties?.map(property => property.key) || [];
    }

    if (this.matPaginator && resultsLength?.currentValue < (this.pagination?.pageSize || 10)) {
      this.matPaginator.pageIndex = 0;
    }
    if (this.matPaginator && pagination?.currentValue) {
      const { pageIndex, pageSize } = pagination.currentValue as PageEventConfig;
      this.matPaginator.pageIndex = pageIndex || 0;
      this.matPaginator.pageSize = pageSize || 10;
    }

    if (filterCriteria) {
      this.dataSource.filter = filterCriteria.currentValue;
    }

    if (data) {
      this.dataSource.data = data.currentValue;
    }

    if (this.matSort && sort) {
      this.matSort.active = sort.currentValue?.[0] || '';
      this.matSort.direction = sort.currentValue?.[1] || 'asc';
    }
  }

  onChangePagination({ previousPageIndex, pageIndex, pageSize }: PageEventConfig) {
    this.changePagination.emit({ previousPageIndex, pageIndex, pageSize });
  }

  onChangeSorting({ active, direction }: TableSorting): void {
    this.changeSorting.emit({
      active,
      direction,
    });
  }

  onDelete(event: Event, element: T): void {
    event.stopPropagation();
    this.delete.emit(element as T);
  }

  /**
   * @description Gets route path data from DOM element data-link attribute and navigates.
   * @param  {HTMLAnchorElement} target - The target HTML anchor element from which to get the route path.
   */
  onGetRoute({ target }: Event) {
    const route = (target as HTMLAnchorElement).getAttribute('data-link');
    this.router.navigateByUrl(route || '/');
  }
}
