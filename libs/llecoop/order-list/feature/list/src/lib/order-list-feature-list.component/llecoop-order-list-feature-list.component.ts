import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { TableFormlyModule } from '@plastik/shared/form/table';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';

import { LlecoopOrderListFeatureListFacadeService } from '../order-list-feature-list-facade.service';

@Component({
  imports: [
    MatIconModule,
    MatButtonModule,
    TableFormlyModule,
    SharedFormFeatureModule,
    SharedTableUiComponent,
  ],
  templateUrl: './llecoop-order-list-feature-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlecoopOrderListFeatureListComponent {
  protected facade = inject(LlecoopOrderListFeatureListFacadeService);
  pendingChanges = signal(false);
}
