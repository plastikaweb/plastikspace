import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { FormattingTypes, SharedUtilFormattersModule } from '@plastik/shared/formatters';
import {
  PageEventConfig,
  TableColumnFormatting,
  TablePaginationVisibility,
  TableSorting,
} from '@plastik/shared/table/entities';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'plastik-shared-table',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CdkTableModule,
    MatTooltipModule,
    RouterModule,
    AngularSvgIconModule,
    SharedUtilFormattersModule,
  ],
  templateUrl: './shared-table-ui.component.html',
  styleUrls: ['./shared-table-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTableUiComponent<T> implements OnChanges, AfterViewInit {
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
  @Input() sort?: TableSorting;

  @Input() filterCriteria = '';

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

  @ViewChild(MatTable) matTable!: MatTable<T>;
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort?: MatSort;

  dataSource = new MatTableDataSource();
  displayedColumns: (string | number | symbol)[] = [];

  ngAfterViewInit() {
    this.displayedColumns = this?.columnProperties?.map(property => property.key) || [];

    if (this.matPaginator && this.pagination) {
      this.matPaginator.pageIndex = this.pagination?.pageIndex || 0;
      this.matPaginator.pageSize = this.pagination?.pageSize || 10;
    }

    if (this.matSort) {
      this.matSort.active = this.sort?.active || '';
      this.matSort.direction = this.sort?.direction || 'asc';
      this.dataSource.sort = this.matSort;
    }

    this.dataSource.data = this.data || [];
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

    if (this.matSort && sort?.currentValue) {
      this.matSort.active = sort.currentValue.active;
      this.matSort.direction = sort.currentValue.direction;
      this.dataSource.sort = this.matSort;
    }

    if (filterCriteria) {
      this.dataSource.filter = filterCriteria.currentValue;
    }

    if (data) {
      this.dataSource.data = data.currentValue;
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
}
