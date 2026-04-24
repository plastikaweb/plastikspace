import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  KeyValuePipe,
  NgComponentOutlet,
  NgOptimizedImage,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
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
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity } from '@plastik/core/entities';
import {
  DataFormatFactoryService,
  FormattingTypes,
  SafeFormattedPipe,
  SharedUtilFormattersModule,
} from '@plastik/shared/formatters';
import { isEmpty } from '@plastik/shared/objects';
import {
  EditableAttributeBase,
  isCheckboxTypeGuard,
  isDynamicComponentTypeGuard,
  isNumberTypeGuard,
  isRadioTypeGuard,
  isSelectTypeGuard,
  isTextareaTypeGuard,
  isTextTypeGuard,
  isToggleTypeGuard,
  PageEventConfig,
  TableColumnFormatting,
  TableDefinition,
  TablePaginationVisibility,
  TableSorting,
  TableSortingConfig,
} from '@plastik/shared/table/entities';

import { OrderTableActionsElementsPipe } from '../utils/order-table-actions-elements.pipe';

/**
 * Shared Table UI Component.
 * Provides a highly configurable table with sorting, pagination, and editable cells.
 */
@Component({
  selector: 'plastik-shared-table',
  imports: [
    RouterLink,
    KeyValuePipe,
    NgComponentOutlet,
    NgTemplateOutlet,
    CdkTableModule,
    CdkTextareaAutosize,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    NgOptimizedImage,
    SharedUtilFormattersModule,
    OrderTableActionsElementsPipe,
    SafeFormattedPipe,
  ],
  templateUrl: './shared-table-ui.component.html',
  styleUrl: './shared-table-ui.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTableUiComponent<T extends BaseEntity & { [key: string]: unknown }>
  implements OnInit
{
  readonly #dataFormatFactoryService = inject(DataFormatFactoryService);
  readonly #liveAnnouncer = inject(LiveAnnouncer);

  /**
   * Data that will populate the table.
   */
  data = input.required<T[]>();

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
    hideRangeButtons: false,
    hideRangeLabel: false,
  });

  /**
   * Main title of the table.
   */
  caption = input<TableDefinition<T>['caption']>('');

  /**
   * Table sorting configuration.
   */
  sort = input<TableSortingConfig>();

  /**
   * Table actions configuration.
   */
  actions = input<TableDefinition<T>['actions']>();

  /**
   * Filter criteria.
   */
  filterCriteria = input<Record<string, string>>({});

  /**
   * Filter predicate function.
   */
  filterPredicate = input<(data: T, criteria: Record<string, string>) => boolean>();

  /**
   * Extra row styles.
   */
  extraRowStyles = input<TableDefinition<T>['extraRowStyles']>();

  /**
   * Actions column styles.
   */
  actionsColStyles = input<TableDefinition<T>['actionsColStyles']>();

  /**
   * Row height.
   */
  rowHeight = input<TableDefinition<T>['rowHeight']>('unset');

  /**
   * Expandable rows configuration.
   */
  expandable = input<boolean>(false);

  /**
   * Expanded element ID.
   */
  expandedElementId = input<EntityId | null>(null);

  /**
   * Expanded detail template.
   */
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

  /**
   * An Output emitter to send changed data.
   */
  getChangedData = output<T | undefined>();

  protected readonly matSort = viewChild<MatSort | null>(MatSort);
  protected readonly matPaginator = viewChild<MatPaginator | null>(MatPaginator);

  protected dataSource = new MatTableDataSource<T>();
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
  protected isDynamicComponent = isDynamicComponentTypeGuard;

  protected expandedElement = signal<T | null>(null);

  constructor() {
    /**
     * Synchronize the data source with the data input signal.
     */
    effect(() => (this.dataSource.data = this.data()));

    /**
     * Synchronize the data source filter with the filter criteria and predicate signals.
     */
    effect(() => {
      if (this.filterCriteria() && this.filterPredicate()) {
        this.dataSource.filter = `${this.filterCriteria()}`;
      }
    });
  }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (data: T, sortHeaderId: string): string | number => {
      const value = sortHeaderId.split('.').reduce((obj, key) => {
        return obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : obj;
      }, data as unknown) as unknown;

      if (value === null || value === undefined) return '';
      if (typeof value === 'number') return value;
      if (typeof value === 'boolean') return value ? 1 : 0;
      if (value instanceof Date) return value.getTime();
      return String(value).toLowerCase();
    };

    if (this.filterPredicate && this.filterCriteria) {
      this.dataSource.filterPredicate = (data: T) => {
        return this.filterPredicate()?.(data as T, this.filterCriteria()) || false;
      };
    }

    if (this.sort()) {
      const matSortInstance = this.matSort();
      if (matSortInstance) {
        matSortInstance.active = this.sort()?.[0] || '';
        matSortInstance.direction = this.sort()?.[1] || 'asc';
        this.dataSource.sort = matSortInstance;
      }
    }
  }

  /**
   * Handles pagination changes.
   * @param config - The pagination configuration.
   */
  onChangePagination({ previousPageIndex, pageIndex, pageSize }: PageEventConfig) {
    if (pageSize !== this.pagination()?.pageSize) {
      pageIndex = 0;
    }
    this.changePagination.emit({
      previousPageIndex,
      pageIndex,
      pageSize,
    });
  }

  /**
   * Handles sorting changes.
   * @param sorting - The sorting configuration.
   */
  protected onChangeSorting({ active, direction }: TableSorting): void {
    this.changeSorting.emit({
      active,
      direction,
    });
    this.#announceSortChange({ active, direction });
  }

  /**
   * Handles the delete action.
   * @param event - The event object.
   * @param element - The element to delete.
   */
  protected onDelete(event: Event, element: T): void {
    event.stopPropagation();
    this.delete.emit(element as T);
  }

  /**
   * Handles input changes in editable cells.
   * @param event - The event object.
   * @param element - The element being edited.
   * @param editableAttr - The editable attribute configuration.
   */
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
   * Updates the expanded element.
   * @param element - The element to expand or null to collapse.
   */
  protected updateExpandedElement(element: T | null): void {
    requestAnimationFrame(() => {
      this.expandedElement.set(this.expandedElement()?.id === element?.id ? null : element);
    });
  }

  /**
   * Announces the sort change for accessibility.
   * @param sortState - The current sort state.
   */
  #announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.#liveAnnouncer.announce(
        `Ordenant columna ${sortState.active} ${sortState.direction === 'asc' ? 'de forma ascendent' : 'de forma descendent'}`,
        'assertive',
        1000
      );
    } else {
      this.#liveAnnouncer.announce('Ordenació cancel·lada');
    }
  }
}
