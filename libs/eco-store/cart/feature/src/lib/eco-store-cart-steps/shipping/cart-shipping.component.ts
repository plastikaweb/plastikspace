import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { EcoStoreCartState, ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { SharedFormFeatureModule } from '@plastik/shared/form';

import { AddressSelectorFormlyModule } from '@plastik/shared/form/address-selector';
import { CustomLabelFormlyModule } from '@plastik/shared/form/custom-label';
import { ShippingMethodSelectorFormlyModule } from '@plastik/shared/form/shipping-method-selector';
import { TextFormlyModule } from '@plastik/shared/form/text';
import { CartOrderPriceSlotsComponent } from '../../ui/cart-order-price-slots/cart-order-price-slots.component';
import { CartOrderSummaryComponent } from '../../ui/cart-order-summary/cart-order-summary.component';
import { getCartShippingFormConfig } from './form/cart-shipping-form.config';

@Component({
  selector: 'eco-cart-shipping',
  imports: [
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    SharedFormFeatureModule,
    ShippingMethodSelectorFormlyModule,
    TextFormlyModule,
    CustomLabelFormlyModule,
    AddressSelectorFormlyModule,
    CartOrderSummaryComponent,
    CartOrderPriceSlotsComponent,
    TranslatePipe,
  ],
  templateUrl: './cart-shipping.component.html',
  styleUrl: './cart-shipping.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartShippingComponent {
  protected readonly cartStore = inject(ecoStoreCartStore);
  protected readonly userProfileStore = inject(pocketBaseUserProfileStore);
  protected readonly tenantStore = inject(ecoStoreTenantStore);
  protected readonly formValid = signal(false);
  protected readonly formConfig = getCartShippingFormConfig();

  protected readonly skeletonItems = computed(() => {
    const count = this.cartStore.itemsCount();
    return Array(count > 0 ? count : 3).fill(0);
  });

  protected readonly model = computed(() => {
    return {
      method: this.cartStore.method(),
      address: this.cartStore.address(),
      day: this.cartStore.day(),
      time: this.cartStore.time(),
    } as Partial<EcoStoreCartState>;
  });

  onChange(event: Partial<EcoStoreCartState>): void {
    this.cartStore.updateLogistics(event);
  }

  onFormValidChange(isValid: boolean): void {
    this.formValid.set(isValid);
  }

  getDeliveryOffer(): number {
    const type = this.cartStore.method() ?? 'pickup';
    const amount = this.cartStore.subtotal();
    const offer = this.tenantStore.getTenantDeliveryPriceForFreeShipping(type, amount);
    return offer > 0 ? offer : 0;
  }
}
