import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UiUserOrderProductCardComponent } from '@plastik/llecoop/user-order/product-card';
import { SharedFormFeatureModule } from '@plastik/shared/form';

import { LlecoopUserOrderProductListFeatureFacadeService } from '../llecoop-user-order-product-list-feature-facade.service';

@Component({
  selector: 'plastik-llecoop-user-order-product-list-feature',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    UiUserOrderProductCardComponent,
    SharedFormFeatureModule,
  ],
  templateUrl: './llecoop-user-order-product-list-feature.component.html',
  styleUrl: './llecoop-user-order-product-list-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlecoopUserOrderProductListFeatureComponent {
  readonly facade = inject(LlecoopUserOrderProductListFeatureFacadeService);
}
