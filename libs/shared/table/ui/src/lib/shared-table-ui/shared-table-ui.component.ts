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
import { BaseEntity, SortConfig } from '@plastik/core/entities';
import {
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
  TableSortingConfig,
} from '@plastik/shared/table/entities';

import { OrderTableActionsElementsPipe } from '../utils/order-table-actions-elements.pipe';

/** Bounded cache for split path keys used in table sorting to prevent repeated string splits and array allocations. */
const SORT_PATH_CACHE = new Map<string, string[]>();
const MAX_SORT_CACHE_SIZE = 100;

/**
 * Retrieves split path array for a property from cache or computes and caches it.
 * @param {string} sortHeaderId - Dot-separated header property key.
 * @returns {string[]} The array of path property names.
 */
function getSortPath(sortHeaderId: string): string[] {
  let path = SORT_PATH_CACHE.get(sortHeaderId);

  if (!path) {
    if (SORT_PATH_CACHE.size >= MAX_SORT_CACHE_SIZE) {
      SORT_PATH_CACHE.clear();
    }

    path = sortHeaderId.split('.');
    SORT_PATH_CACHE.set(sortHeaderId, path);
  }

  return path;
}

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
export class SharedTableUiComponent<T extends BaseEntity & { [key: string]: unknown }> {
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

  filterCriteria = input<Record<string, string>>({});

  filterPredicate = input<(data: T, criteria: Record<string, string>) => boolean>();

  extraRowStyles = input<TableDefinition<T>['extraRowStyles']>();

  actionsColStyles = input<TableDefinition<T>['actionsColStyles']>();

  rowHeight = input<TableDefinition<T>['rowHeight']>('unset');

  expandable = input<boolean>(false);

  expandedElementId = input<EntityId | null>(null);

  expandedDetailTpl = input<TemplateRef<unknown> | null>(null);

  /**
   * An Output emitter to send table pagination changes.
   */
  changePagination = output<PageEventConfig>();

  /**
   * An Output emitter to send table sorting changes.
   */
  changeSorting = output<SortConfig>();

  /**
   * An Output emitter to send table delete action.
   */
  delete = output<T>();

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
  readonly #liveAnnouncer = inject(LiveAnnouncer);

  constructor() {
    this.dataSource.sortingDataAccessor = (data: T, sortHeaderId: string): string | number => {
      let value: unknown;

      // Fast-path for non-nested properties (over 90% of table columns) to avoid split and reduce allocations.
      if (!sortHeaderId.includes('.')) {
        value = (data as Record<string, unknown>)[sortHeaderId];
      } else {
        const keys = getSortPath(sortHeaderId);
        let curr: unknown = data;

        for (let i = 0; i < keys.length; i++) {
          if (curr === null || curr === undefined || typeof curr !== 'object') {
            curr = undefined;

            break;
          }

          curr = (curr as Record<string, unknown>)[keys[i]];
        }

        value = curr;
      }

      if (value === null || value === undefined) return '';
      if (typeof value === 'number') return value;
      if (typeof value === 'boolean') return value ? 1 : 0;
      if (value instanceof Date) return value.getTime();

      return String(value).toLowerCase();
    };

    /**
     * Synchronize the data source with the data input signal.
     */
    effect(() => (this.dataSource.data = this.data()));

    /**
     * Synchronize the data source filter with the filter criteria and predicate input signals.
     */
    effect(() => {
      const criteria = this.filterCriteria();
      const predicate = this.filterPredicate();

      if (criteria && predicate) {
        this.dataSource.filterPredicate = (data: T) => {
          return predicate(data, criteria);
        };
        this.dataSource.filter = JSON.stringify(criteria);
      } else {
        this.dataSource.filter = '';
      }
    });

    /**
     * Synchronize the data source sort with the sort input and matSort viewChild signals.
     */
    effect(() => {
      const matSortInstance = this.matSort();
      const sortConfig = this.sort();

      if (matSortInstance && sortConfig) {
        matSortInstance.active = sortConfig[0] || '';
        matSortInstance.direction = sortConfig[1] || 'asc';
        this.dataSource.sort = matSortInstance;
      }
    });

    /**
     * Synchronize the data source paginator with the matPaginator viewChild signal.
     */
    effect(() => {
      const paginator = this.matPaginator();

      if (paginator) {
        this.dataSource.paginator = paginator;
      }
    });
  }

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

  protected onChangeSorting({ active, direction }: SortConfig): void {
    this.changeSorting.emit({
      active,
      direction,
    });
    this.#announceSortChange({ active, direction });
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

  protected updateExpandedElement(element: T | null): void {
    requestAnimationFrame(() => {
      this.expandedElement.set(this.expandedElement()?.id === element?.id ? null : element);
    });
  }

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
