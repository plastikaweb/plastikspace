import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CanDeactivateComponent } from '@plastik/core/can-deactivate';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { TableFormlyModule } from '@plastik/shared/form/table';
import { TableSorting } from '@plastik/shared/table/entities';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';
import { LlecoopOrderListDetailListFacadeService } from '../order-list-detail-list-facade.service';

@Component({
  selector: 'plastik-llecoop-order-list-feature-detail',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterLink,
    TableFormlyModule,
    SharedFormFeatureModule,
    SharedTableUiComponent,
  ],
  templateUrl: './llecoop-order-list-feature-detail.component.html',
  styleUrl: './llecoop-order-list-feature-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlecoopOrderListFeatureDetailComponent implements CanDeactivateComponent {
  protected facade = inject(LlecoopOrderListDetailListFacadeService);
  pendingChanges = signal(false);

  protected onChangeSorting(tableSorting: TableSorting): void {
    this.facade.onTableSorting?.(tableSorting);
  }

  protected onChangeFiltering(model: Record<string, string>): void {
    this.facade.onChangeFilterCriteria?.(model);
  }

  protected onSaveUserOrder(model: Pick<LlecoopUserOrder, 'id' | 'cart' | 'orderListId'>): void {
    this.pendingChanges.set(false);
    this.facade.onSaveUserOrder(model);
  }
}
