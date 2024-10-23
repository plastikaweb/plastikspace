import { CdkTableModule } from '@angular/cdk/table';
import { KeyValuePipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { BaseEntity } from '@plastik/core/entities';
import {
  FormattingTypes,
  PropertyFormattingConf,
  SharedUtilFormattersModule,
} from '@plastik/shared/formatters';
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
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './shared-table-ui.component.html',
  styleUrls: ['./shared-table-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTableUiComponent<T extends BaseEntity & { [key: string]: unknown }>
  implements OnChanges, AfterViewInit
{
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  /**
   * Data that will populate the table.
   */
  data = input<T[]>([]);

  /**
   * Table columns structure.
   */
  columnProperties = input.required<TableColumnFormatting<T, FormattingTypes>[]>();

  /**
   * The total number of items available for the current table data request.
   * Used for pagination and to show the total number of items.
   */
  resultsLength = input<number>();

  /**
   * Pagination configuration.
   */
  pagination = input<PageEventConfig>();

  /**
   * Remove pagination component to the table. Present by default.
   */
  noPagination = input<boolean>(false);

  /**
   * Sets the pagination elements visibility configuration.
   */
  paginationVisibility = input<Partial<TablePaginationVisibility> | undefined>({
    hidePageSize: false,
    hidePaginationFirstLastButtons: false,
    hideRangeButtons: false,
    hideRangeLabel: false,
  });

  /**
   * Page sizes available.
   * array with the number of items per page.
   */
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);

  /**
   * Main title of the table.
   */
  caption = input<string>('');

  /**
   * Table sorting configuration.
   */
  sort = input<TableSortingConfig>();

  /**
   * Table actions configuration.
   */
  actions = input<TableControlAction<T>>();

  filterCriteria = input<Record<string, string>>({});

  filterPredicate = input<(data: T, criteria: Record<string, string>) => boolean>();

  extraRowStyles = input<(element: T) => string>();

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

  @Output()
  getData = new EventEmitter<T[]>();

  @Output()
  getChangedData = new EventEmitter<T>();

  @ViewChild(MatTable) matTable!: MatTable<T>;
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort?: MatSort;

  protected dataSource = new MatTableDataSource<T>([]);
  protected displayedColumns = computed(() => {
    const actions = this.actions();
    const cols = this.columnProperties().map(property => property.key) || [];
    return actions ? [...cols, 'actions'] : cols;
  });

  ngAfterViewInit() {
    if (this.matPaginator && this.pagination) {
      this.matPaginator.pageIndex = this.pagination()?.pageIndex || 0;
      this.matPaginator.pageSize = this.pagination()?.pageSize || 10;
    }

    if (this.matSort) {
      this.matSort.active = this.sort()?.[0] || '';
      this.matSort.direction = this.sort()?.[1] || 'asc';
      this.dataSource.sort = this.matSort;
    }

    if (this.filterPredicate && this.filterCriteria) {
      this.dataSource.filterPredicate = (data: T) => {
        return this.filterPredicate()?.(data as T, this.filterCriteria()) || false;
      };
    }
  }

  ngOnChanges({ data, resultsLength, pagination, sort, filterCriteria }: SimpleChanges) {
    if (this.matPaginator && resultsLength?.currentValue < (this.pagination()?.pageSize || 10)) {
      this.matPaginator.pageIndex = 0;
    }
    if (this.matPaginator && pagination?.currentValue) {
      const { pageIndex, pageSize } = pagination.currentValue as PageEventConfig;
      this.matPaginator.pageIndex = pageIndex || 0;
      this.matPaginator.pageSize = pageSize || 10;
    }

    if (filterCriteria && !filterCriteria.firstChange && this.filterPredicate()) {
      this.dataSource.filter = `${filterCriteria.currentValue}`;
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

  onGetData(): void {
    this.getData.emit(this.dataSource.data);
  }

  protected onChangeInput(
    event: Event,
    row: T,
    formatting: PropertyFormattingConf<T, 'INPUT'>
  ): void {
    event.stopPropagation();
    const value = (event.target as HTMLInputElement).value;
    const newRow = formatting?.onInputChanges?.(value, row);
    row = { ...row, ...newRow };
    this.getChangedData.emit(row);
    const newData = this.data().map(item => (item.id === row.id ? row : item));
    this.dataSource.data = newData;
    this.getData.emit(newData);
    this.cdr.detectChanges();
  }
}
