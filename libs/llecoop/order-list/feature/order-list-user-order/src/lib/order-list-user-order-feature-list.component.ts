import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CanDeactivateComponent } from '@plastik/core/can-deactivate';
import { UserOrderUtilsService } from '@plastik/llecoop/order-list/util';
import { UserOrderCardDetailComponent } from '@plastik/llecoop/user-order-card';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { TableFormlyModule } from '@plastik/shared/form/table';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';

import { LlecoopOrderListUserOrderFeatureListFacadeService } from './order-list-user-order-feature-list-facade.service';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    RouterLink,
    TableFormlyModule,
    SharedFormFeatureModule,
    SharedTableUiComponent,
    UserOrderCardDetailComponent,
  ],
  templateUrl: './order-list-user-order-feature-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListUserOrderFeatureListComponent implements CanDeactivateComponent {
  protected readonly facade = inject(LlecoopOrderListUserOrderFeatureListFacadeService);
  protected readonly userOrderUtilsService = inject(UserOrderUtilsService);
  pendingChanges = signal(false);
}
