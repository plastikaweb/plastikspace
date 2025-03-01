import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
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
  protected readonly orderListStore = inject(llecoopOrderListStore);
  protected readonly userOrderStore = inject(llecoopUserOrderStore);
}
