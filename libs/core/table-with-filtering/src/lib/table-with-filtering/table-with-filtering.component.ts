import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BaseEntity } from '@plastik/core/entities';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { PageEventConfig, TableSorting } from '@plastik/shared/table/entities';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';

import { TABLE_WITH_FILTERING_FACADE } from './table-with-filtering-facade.type';

@Component({
  imports: [
    MatIconModule,
    MatButtonModule,
    TitleCasePipe,
    RouterLink,
    SharedTableUiComponent,
    SharedFormFeatureModule,
  ],
  templateUrl: './table-with-filtering.component.html',
  styleUrl: './table-with-filtering.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableWithFilteringComponent {
  protected facade = inject(TABLE_WITH_FILTERING_FACADE);

  onChangeSorting(tableSorting: TableSorting): void {
    this.facade.onTableSorting?.(tableSorting);
  }

  onChangeFiltering(model: Record<string, string>): void {
    this.facade.onChangeFilterCriteria?.(model);
  }

  onChangePagination({ pageIndex, pageSize }: PageEventConfig): void {
    this.facade.onChangePagination?.({ pageIndex, pageSize });
  }

  onDelete(item: BaseEntity): void {
    this.facade.onTableActionDelete?.(item);
  }
}
