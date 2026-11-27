import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SubmitFormConfig } from '@plastik/core/entities';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import { UserOrderUtilsService } from '@plastik/llecoop/order-list/util';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { TableFormlyModule } from '@plastik/shared/form/table';

@Component({
  selector: 'plastik-user-order-card-detail',
  imports: [MatCardModule, MatIconModule, SharedFormFeatureModule, TableFormlyModule],
  templateUrl: './user-order-card-detail.component.html',
  styleUrl: './user-order-card-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrderCardDetailComponent {
  protected readonly userOrderUtilsService = inject(UserOrderUtilsService);
  readonly order = input<LlecoopUserOrder | null>(null);
  readonly fields = input<FormlyFieldConfig[]>([]);
  readonly submitConfig = input<SubmitFormConfig>({});

  readonly pendingChangesEvent = output<boolean>();
  readonly changeEvent = output<Pick<LlecoopUserOrder, 'id' | 'cart' | 'orderListId'>>();
}
