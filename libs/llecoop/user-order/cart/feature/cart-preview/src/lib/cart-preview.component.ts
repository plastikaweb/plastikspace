import { OverlayModule } from '@angular/cdk/overlay';
import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';
import { UserOrderMiniCart } from '@plastik/llecoop/user-order/mini-cart';

@Component({
  selector: 'plastik-cart-preview',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    CurrencyPipe,
    UserOrderMiniCart,
    OverlayModule,
  ],
  templateUrl: './cart-preview.component.html',
  styleUrls: ['./cart-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPreviewComponent {
  readonly userOrderCartStore = inject(llecoopUserOrderCartStore);
  isOpen = false;
}
