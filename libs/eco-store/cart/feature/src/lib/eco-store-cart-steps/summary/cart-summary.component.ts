import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { EcoStoreProductPriceComponent } from '@plastik/eco-store/product-price';
import { EcoStoreProductQuantityComponent } from '@plastik/eco-store/product-quantity';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';

@Component({
  selector: 'eco-cart-summary',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CurrencyPipe,
    TranslatePipe,
    KeyValuePipe,
    PocketBaseImageUrlPipe,
    SharedImgContainerComponent,
    EcoStoreProductPriceComponent,
    EcoStoreProductQuantityComponent,
  ],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly cartStore = inject(ecoStoreCartStore);

  nextStep() {
    this.#router.navigate(['../shipping'], { relativeTo: this.#route });
  }

  onQuantityChange(event: number, product: EcoStoreProductWithCategoryName) {
    this.cartStore.addToCart(product, event);
  }
}
