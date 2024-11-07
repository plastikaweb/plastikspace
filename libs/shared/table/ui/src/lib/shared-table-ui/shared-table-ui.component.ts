import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkTableModule } from '@angular/cdk/table';
import { KeyValuePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { FormattingTypes, SharedUtilFormattersModule } from '@plastik/shared/formatters';
import { isEmpty, isString } from '@plastik/shared/objects';
import {
  EditableAttributeBase,
  isCheckboxTypeGuard,
  isNumberTypeGuard,
  isRadioTypeGuard,
  isSelectTypeGuard,
  isTextareaTypeGuard,
  isTextTypeGuard,
  isToggleTypeGuard,
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
import { BaseEntity } from '@plastik/core/entities';

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
    MatButtonModule,
    AngularSvgIconModule,
    SharedUtilFormattersModule,
    TableCellTitleDirective,
    OrderTableActionsElementsPipe,
    KeyValuePipe,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    NgTemplateOutlet,
  ],
  templateUrl: './shared-table-ui.component.html',
  styleUrls: ['./shared-table-ui.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTableUiComponent<T extends BaseEntity & { [key: string]: unknown }>
  implements OnInit
{
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
  resultsLength = input.required<number>();

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

  actionsColStyles = input<string>('');

  expandable = input<boolean>(false);

  expandedDetailTpl = input<TemplateRef<unknown> | null>(null);

  /**
   * An Output emitter to send table pagination changes.
   */
  changePagination = output<PageEventConfig>();

  /**
   * An Output emitter to send table sorting changes.
   */
  changeSorting = output<TableSorting>();

  /**
   * An Output emitter to send table delete action.
   */
  delete = output<T>();

  getData = output<T[]>();

  getChangedData = output<T | undefined>();

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort?: MatSort;
  @ViewChildren('matFormField', { emitDistinctChangesOnly: true }) matFormField?: ElementRef;

  protected dataSource = new MatTableDataSource<T>([]);
  protected columnsToDisplay = computed(() => {
    const actions = this.actions();
    const cols = this.columnProperties().map(property => property.key) || [];
    return [
      ...(this.expandable() ? ['expand'] : []),
      ...cols,
      ...(!!actions && !isEmpty(actions) ? ['actions'] : []),
    ];
  });

  protected isNumber = isNumberTypeGuard;
  protected isText = isTextTypeGuard;
  protected isTextarea = isTextareaTypeGuard;
  protected isSelect = isSelectTypeGuard;
  protected isCheckBox = isCheckboxTypeGuard;
  protected isRadio = isRadioTypeGuard;
  protected isToggle = isToggleTypeGuard;

  protected expandedElement = signal<T | null>(null);

  constructor() {
    effect(() => (this.dataSource.data = this.data()));
    effect(() => {
      if (this.matSort && this.sort()) {
        this.matSort.active = this.sort()?.[0] || '';
        this.matSort.direction = this.sort()?.[1] || 'asc';
        this.dataSource.sort = this.matSort;
      }
    });
    effect(() => {
      if (this.filterCriteria() && this.filterPredicate()) {
        this.dataSource.filter = `${this.filterCriteria()}`;
      }
    });
    effect(() => {
      if (this.matPaginator && this.pagination()) {
        const pageIndex =
          this.resultsLength() < (this.pagination()?.pageSize || 10)
            ? 0
            : this.pagination()?.pageIndex || 0;
        this.matPaginator.pageIndex = pageIndex;
        this.matPaginator.pageSize = this.pagination()?.pageSize || this.resultsLength();
        this.dataSource.paginator = this.matPaginator;
      }
    });
  }

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (data: T, sortHeaderId: string): string | number => {
      return isString(data[sortHeaderId])
        ? data[sortHeaderId].toLowerCase()
        : (data[sortHeaderId] as number);
    };

    if (this.filterPredicate && this.filterCriteria) {
      this.dataSource.filterPredicate = (data: T) => {
        return this.filterPredicate()?.(data as T, this.filterCriteria()) || false;
      };
    }
  }

  protected onChangePagination({ previousPageIndex, pageIndex, pageSize }: PageEventConfig) {
    this.changePagination.emit({ previousPageIndex, pageIndex, pageSize });
  }

  protected onChangeSorting({ active, direction }: TableSorting): void {
    this.changeSorting.emit({
      active,
      direction,
    });
  }

  protected onDelete(event: Event, element: T): void {
    event.stopPropagation();
    this.delete.emit(element as T);
  }

  protected onInputChange(
    event: Event | MatSelectChange | MatCheckboxChange | MatRadioChange | MatSlideToggleChange,
    element: T,
    editableAttr: EditableAttributeBase<T>
  ): void {
    let value: string | number | boolean;
    if (event instanceof MatSelectChange || event instanceof MatRadioChange) {
      value = event.value;
    } else if (event instanceof MatCheckboxChange || event instanceof MatSlideToggleChange) {
      value = event.checked;
    } else {
      value = (event.target as HTMLInputElement).value;
    }
    const result = editableAttr.onChanges?.(value, element);
    this.getChangedData.emit(result);
  }

  /**
   * @description Gets route path data from DOM element data-link attribute and navigates.
   * @param  {HTMLAnchorElement} target - The target HTML anchor element from which to get the route path.
   */
  protected onGetRoute({ target }: Event) {
    const route = (target as HTMLAnchorElement).getAttribute('data-link');
    this.router.navigateByUrl(route || '/');
  }

  protected setCellNgClass(column: TableColumnFormatting<T, FormattingTypes>): {
    [className: string]: boolean;
  } {
    return {
      ...(column.cssClasses?.[0] ? { [column.cssClasses[0]]: true } : {}),
      ...(column.formatting.type === 'INPUT' ? { 'mat-cell-input': true } : {}),
      ...(column.formatting.type === 'LINK' ? { 'mat-cell-link': true } : {}),
    };
  }
}
