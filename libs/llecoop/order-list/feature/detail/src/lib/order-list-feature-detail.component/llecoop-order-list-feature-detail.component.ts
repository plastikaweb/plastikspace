import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { TableSorting } from '@plastik/shared/table/entities';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';
import { LlecoopOrderListDetailListFacadeService } from '../order-list-detail-list-facade.service';

@Component({
  selector: 'plastik-llecoop-order-list-feature-detail',
  standalone: true,
  imports: [
    SharedFormFeatureModule,
    SharedTableUiComponent,
    MatIconModule,
    TitleCasePipe,
    MatButtonModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './llecoop-order-list-feature-detail.component.html',
  styleUrl: './llecoop-order-list-feature-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlecoopOrderListFeatureDetailComponent {
  protected facade = inject(LlecoopOrderListDetailListFacadeService);

  onChangeSorting(tableSorting: TableSorting): void {
    this.facade.onTableSorting?.(tableSorting);
  }

  onChangeFiltering(model: Record<string, string>): void {
    this.facade.onChangeFilterCriteria?.(model);
  }

  onSaveUserOrder(model: Pick<LlecoopUserOrder, 'id' | 'cart' | 'orderListId'>): void {
    this.facade.onSaveUserOrder(model);
  }
}
