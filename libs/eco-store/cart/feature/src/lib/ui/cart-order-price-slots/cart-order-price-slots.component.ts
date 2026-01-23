import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreTenantLogisticsDeliveryTier } from '@plastik/eco-store/entities';

@Component({
  selector: 'eco-cart-order-price-slots',
  standalone: true,
  imports: [CurrencyPipe, MatProgressBarModule, TranslateModule, MatIcon],
  templateUrl: './cart-order-price-slots.component.html',
  styleUrl: './cart-order-price-slots.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderPriceSlotsComponent {
  tiers = input.required<EcoStoreTenantLogisticsDeliveryTier[]>();
  cartTotal = input.required<number>();

  sortedTiersAsc = computed(() =>
    this.tiers()
      .slice()
      .sort((a, b) => a.min - b.min)
  );

  sortedTiersDesc = computed(() =>
    this.tiers()
      .slice()
      .sort((a, b) => b.min - a.min)
  );

  currentTier = computed(() => {
    const total = this.cartTotal();
    return this.sortedTiersDesc().find(tier => total >= tier.min);
  });

  isFree = computed(() => this.currentTier()?.cost === 0);

  maxTier = computed(() => {
    const tiers = this.sortedTiersAsc();
    return tiers.length > 0 ? tiers[tiers.length - 1] : null;
  });

  remainingForFree = computed(() => {
    const total = this.cartTotal();
    const tier = this.maxTier();
    if (tier === null || tier.min <= total) return 0;
    return tier.min - total;
  });

  progress = computed(() => {
    const total = this.cartTotal();
    const max = this.maxTier()?.min || 1;
    let progress = (total / max) * 100;
    if (max === 0 || progress > 100) {
      progress = 100;
    }
    return progress;
  });

  isCurrentTier = (tierMin: number): boolean => {
    const tier = this.currentTier();
    return tier?.min === tierMin;
  };
}
