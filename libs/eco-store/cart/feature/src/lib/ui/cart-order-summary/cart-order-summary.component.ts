import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EcoStoreTenantLogisticsDeliveryType } from '@plastik/eco-store/entities';

@Component({
  selector: 'eco-cart-order-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, TranslatePipe, RouterLink],
  templateUrl: './cart-order-summary.component.html',
  styleUrl: './cart-order-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderSummaryComponent {
  subtotal = input.required<number>();
  taxes = input.required<number>();
  total = input.required<number>();
  shipping = input<number>(0);
  actionButtonText = input<string>('');
  actionRoute = input<string[]>();
  deliveryType = input<EcoStoreTenantLogisticsDeliveryType>();
}
