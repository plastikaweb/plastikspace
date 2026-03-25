import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { EcoStoreSharedNoResultsComponent } from '@plastik/eco-store/no-results';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { take } from 'rxjs';
import { CartOrderSummaryComponent } from '../../ui/cart-order-summary/cart-order-summary.component';
import { CartProductCardComponent } from '../../ui/cart-product-card/cart-product-card.component';

@Component({
  selector: 'eco-cart-summary',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TranslatePipe,
    RouterLink,
    CartOrderSummaryComponent,
    CartProductCardComponent,
    EcoStoreSharedNoResultsComponent,
  ],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly cartStore = inject(ecoStoreCartStore);
  readonly tenantStore = inject(ecoStoreTenantStore);
  readonly profileStore = inject(pocketBaseUserProfileStore);
  readonly #confirmService = inject(SharedConfirmDialogService);
  readonly #translate = inject(TranslateService);
  readonly #router = inject(Router);

  /**
   * Computes skeleton items for the cart summary based on the number of items in the cart or a default count during initial sync.
   */
  protected readonly skeletonItems = linkedSignal({
    source: () => ({
      isSyncing: this.cartStore.isSyncing(),
      isSynced: this.cartStore.isSynced(),
      count: this.cartStore.itemsCount(),
    }),
    computation: s => {
      if (s.isSyncing && !s.isSynced) {
        const count = s.count > 0 ? s.count : 0;
        return Array(count).fill(0);
      }
      return [];
    },
  });

  onQuantityChange(event: { quantity: number; product: EcoStoreProductWithCategoryName }) {
    this.cartStore.addToCart(event.product, event.quantity);
  }

  onTrialExpired() {
    this.#confirmService
      .confirm(
        'store.trial.expiredTitle',
        'store.trial.expiredMessage',
        'store.trial.expiredSecondary',
        'store.trial.expiredCta'
      )
      .pipe(take(1))
      .subscribe(result => {
        if (result) {
          // TODO: Redirect to PRV-06 (sol·licitud d'adhesió)
          // For now, go to profile or contact
          this.#router.navigate(['/perfil']);
        }
      });
  }
}
