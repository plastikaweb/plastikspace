import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EcoStoreCartItem, EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { EcoStoreProductPriceComponent } from '@plastik/eco-store/product-price';
import { EcoStoreProductQuantityComponent } from '@plastik/eco-store/product-quantity';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { NewPriceWarningComponent } from '../new-price-warning/new-price-warning.component';

@Component({
  selector: 'eco-cart-product-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    PocketBaseImageUrlPipe,
    SharedImgContainerComponent,
    EcoStoreProductQuantityComponent,
    NewPriceWarningComponent,
    EcoStoreProductPriceComponent,
    TranslatePipe,
    CurrencyPipe,
  ],
  templateUrl: './cart-product-card.component.html',
  styleUrl: './cart-product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartProductCardComponent {
  item = input.required<EcoStoreCartItem>();
  isLcpImage = input(false);
  editable = input<boolean>();

  quantityChange = output<{ quantity: number; product: EcoStoreProductWithCategoryName }>();
}
