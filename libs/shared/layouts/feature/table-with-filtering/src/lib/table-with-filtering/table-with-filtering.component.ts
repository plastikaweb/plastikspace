import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';
import { TABLE_WITH_FILTERING_TOKEN } from './table-with-filtering-facade.type';
import { TableSorting } from '@plastik/shared/table/entities';

@Component({
  selector: 'plastik-table-with-filtering',
  standalone: true,
  imports: [SharedTableUiComponent, TitleCasePipe],
  templateUrl: './table-with-filtering.component.html',
  styleUrl: './table-with-filtering.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableWithFilteringComponent {
  protected facade = inject(TABLE_WITH_FILTERING_TOKEN);

  onChangeSorting(tableSorting: TableSorting): void {
    this.facade.onChangeSorting(tableSorting);
  }
}
