import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { TextAreaWithCounterFormlyModule } from '@plastik/shared/form/textarea-with-counter';
import { ViewTransitionService } from '@plastik/shared/util/view-transition';
import { CartOrderSummaryComponent } from '../../ui/cart-order-summary/cart-order-summary.component';
import { CartProductCardComponent } from '../../ui/cart-product-card/cart-product-card.component';
import {
  CartConfirmationFormModel,
  getCartConfirmationFormConfig,
} from './form/cart-confirmation-form.config';

@Component({
  selector: 'eco-cart-confirmation',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    TranslatePipe,
    SharedFormFeatureModule,
    TextAreaWithCounterFormlyModule,
    CartOrderSummaryComponent,
    CartProductCardComponent,
  ],
  templateUrl: './cart-confirmation.component.html',
  styleUrl: './cart-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartConfirmationComponent {
  protected readonly cartStore = inject(ecoStoreCartStore);
  protected readonly tenantStore = inject(ecoStoreTenantStore);
  protected readonly formConfig = getCartConfirmationFormConfig();
  protected readonly viewTransitionService = inject(ViewTransitionService);

  protected readonly model = computed<CartConfirmationFormModel>(() => ({
    notes: this.cartStore.notes() ?? '',
  }));

  protected onChange(event: CartConfirmationFormModel): void {
    this.cartStore.updateLogistics({ notes: event.notes || null });
  }

  protected confirmOrder(): void {
    // TODO: Implement order submission via cart store or service
  }
}
