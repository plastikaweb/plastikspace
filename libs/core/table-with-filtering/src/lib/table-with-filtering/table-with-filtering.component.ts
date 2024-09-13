import { JsonPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterArrayPipe } from '@plastik/shared/filter-array-pipe';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { TableSorting } from '@plastik/shared/table/entities';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';
import { TABLE_WITH_FILTERING_FACADE } from './table-with-filtering-facade.type';

@Component({
  selector: 'plastik-table-with-filtering',
  standalone: true,
  imports: [
    SharedTableUiComponent,
    SharedFormFeatureModule,
    TitleCasePipe,
    MatIconModule,
    FilterArrayPipe,
  ],
  templateUrl: './table-with-filtering.component.html',
  styleUrl: './table-with-filtering.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableWithFilteringComponent {
  protected facade = inject(TABLE_WITH_FILTERING_FACADE);

  onChangeSorting(tableSorting: TableSorting): void {
    this.facade.onSorting?.(tableSorting);
  }

  onChangeFiltering(model: object): void {
    this.facade.onSearch?.(model);
  }
}
