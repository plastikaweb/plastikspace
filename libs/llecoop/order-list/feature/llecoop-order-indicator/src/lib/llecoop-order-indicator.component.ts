import { CurrencyPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';

@Component({
  selector: 'plastik-llecoop-order-indicator',
  standalone: true,
  imports: [MatIconModule, MatBadgeModule, MatButtonModule, CurrencyPipe, JsonPipe],
  templateUrl: './llecoop-order-indicator.component.html',
  styleUrl: './llecoop-order-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlecoopOrderIndicatorComponent {
  protected readonly userOrderStore = inject(LlecoopUserOrderStore);
  protected readonly orderListStore = inject(LLecoopOrderListStore);
}
