import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreTenantLogisticsDeliveryType } from '@plastik/eco-store/entities';

@Component({
  selector: 'eco-cart-order-summary',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, MatCardModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './cart-order-summary.component.html',
  styleUrl: './cart-order-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderSummaryComponent {
  private readonly router = inject(Router);
  submitAvailable = input<boolean>(true);
  subtotal = input.required<number>();
  taxes = input.required<number>();
  total = input.required<number>();
  shipping = input<number>(0);
  actionButtonText = input<string>('');
  actionRoute = input<string[]>();
  actionClick = output<void>();
  deliveryType = input<EcoStoreTenantLogisticsDeliveryType>('pickup');
  isStoreOpen = input<boolean>(true);
  nextOpenDate = input<Date | null>(null);

  handleAction() {
    const route = this.actionRoute();

    if (route) {
      this.router.navigate(route);
    } else {
      this.actionClick.emit();
    }
  }
}
