import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
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
  readonly item = input.required<EcoStoreCartItem>();
  readonly isLcpImage = input(false);
  readonly editable = input<boolean>();
  readonly showImage = input(true);

  readonly quantityChange = output<{
    quantity: number;
    product: EcoStoreProductWithCategoryName;
  }>();
}
