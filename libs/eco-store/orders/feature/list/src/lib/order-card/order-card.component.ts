import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizedFields } from '@plastik/core/entities';
import {
  EcoStoreOrder,
  ORDER_DELIVERY_ICON_MAP,
  ORDER_DELIVERY_LABEL_MAP,
  ORDER_STATUS_ICON_MAP,
  ORDER_STATUS_LABEL_MAP,
  ORDER_STATUS_TYPE_MAP,
} from '@plastik/eco-store/entities';
import { SharedChipComponent } from '@plastik/shared/chip/ui';

@Component({
  selector: 'eco-order-card',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    SharedChipComponent,
    TranslateModule,
  ],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCardComponent {
  readonly order = input.required<EcoStoreOrder>();
  protected readonly currentLanguage = inject(TranslateService).getCurrentLang();

  readonly viewDetail = output<void>();

  protected readonly statusLabel = computed(() => ORDER_STATUS_LABEL_MAP[this.order().status]);
  protected readonly statusType = computed(() => ORDER_STATUS_TYPE_MAP[this.order().status]);
  protected readonly isCancelled = computed(() => this.order().status === 'CANCELLED');

  protected readonly statusIcon = computed(() => ORDER_STATUS_ICON_MAP[this.order().status]);

  protected readonly deliveryIcon = computed(
    () => ORDER_DELIVERY_ICON_MAP[this.order().deliveryMethod]
  );
  protected readonly deliveryLabel = computed(
    () => ORDER_DELIVERY_LABEL_MAP[this.order().deliveryMethod]
  );

  protected readonly itemNames = computed(() =>
    this.order()
      .items.map(item => (item.name as LocalizedFields<string>)[this.currentLanguage])
      .join(', ')
  );
}
