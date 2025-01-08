import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';

@Component({
  selector: 'plastik-llecoop-order-indicator',
  imports: [
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatChipsModule,
    CurrencyPipe,
    RouterLink,
  ],
  templateUrl: './llecoop-order-indicator.component.html',
  styleUrl: './llecoop-order-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlecoopOrderIndicatorComponent {
  protected readonly userOrderStore = inject(LlecoopUserOrderStore);
  protected readonly orderListStore = inject(LLecoopOrderListStore);

  protected openedUserOrderList = computed(() => {
    const openedOrderListId = this.orderListStore.currentOrder()?.id;
    return openedOrderListId
      ? this.userOrderStore
          .entities()
          .filter((entity: LlecoopUserOrder) => entity.orderListId === openedOrderListId)[0]
      : null;
  });
}
