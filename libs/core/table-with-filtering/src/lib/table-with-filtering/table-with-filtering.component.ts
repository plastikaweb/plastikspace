import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
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
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './table-with-filtering.component.html',
  styleUrl: './table-with-filtering.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableWithFilteringComponent {
  protected facade = inject(TABLE_WITH_FILTERING_FACADE);
  protected filterCriteria = signal('');

  onChangeSorting(tableSorting: TableSorting): void {
    this.facade.onSorting?.(tableSorting);
  }

  onChangeFiltering(model: { text: string }): void {
    this.filterCriteria.update(() => {
      return model.text.trim().toLowerCase();
    });
  }
}
