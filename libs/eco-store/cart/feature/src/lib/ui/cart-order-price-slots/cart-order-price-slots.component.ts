import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreTenantLogisticsDeliveryTier } from '@plastik/eco-store/entities';

@Component({
  selector: 'eco-cart-order-price-slots',
  imports: [CurrencyPipe, MatProgressBarModule, TranslateModule, MatIcon],
  templateUrl: './cart-order-price-slots.component.html',
  styleUrl: './cart-order-price-slots.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderPriceSlotsComponent {
  readonly tiers = input.required<EcoStoreTenantLogisticsDeliveryTier[]>();
  readonly cartTotal = input.required<number>();

  readonly sortedTiersAsc = computed(() =>
    this.tiers()
      .slice()
      .sort((a, b) => a.min - b.min)
  );

  readonly sortedTiersDesc = computed(() =>
    this.tiers()
      .slice()
      .sort((a, b) => b.min - a.min)
  );

  readonly currentTier = computed(() => {
    const total = this.cartTotal();

    return this.sortedTiersDesc().find(tier => total >= tier.min);
  });

  readonly activeTierMin = computed(() => this.currentTier()?.min);

  readonly isFree = computed(() => this.currentTier()?.cost === 0);

  readonly maxTier = computed(() => {
    const tiers = this.sortedTiersAsc();

    return tiers.length > 0 ? tiers[tiers.length - 1] : null;
  });

  readonly remainingForFree = computed(() => {
    const total = this.cartTotal();
    const tier = this.maxTier();

    if (tier === null || tier.min <= total) return 0;

    return tier.min - total;
  });

  readonly progress = computed(() => {
    const total = this.cartTotal();
    const max = this.maxTier()?.min || 1;
    let progress = (total / max) * 100;

    if (max === 0 || progress > 100) {
      progress = 100;
    }

    return progress;
  });
}
