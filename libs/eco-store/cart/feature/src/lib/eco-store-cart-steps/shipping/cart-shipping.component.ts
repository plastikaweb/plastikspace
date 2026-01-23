import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { EcoStoreCartState, ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreTenantBaseService } from '@plastik/eco-store/tenant';
import { SharedFormFeatureModule } from '@plastik/shared/form';

import { AddressSelectorFormlyModule } from '@plastik/shared/form/address-selector';
import { CustomLabelFormlyModule } from '@plastik/shared/form/custom-label';
import { ShippingMethodSelectorFormlyModule } from '@plastik/shared/form/shipping-method-selector';
import { CartOrderSummaryComponent } from '../../ui/cart-order-summary/cart-order-summary.component';
import { getCartShippingFormConfig } from './cart-shipping-form.config';

@Component({
  selector: 'eco-cart-shipping',
  standalone: true,
  imports: [
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedFormFeatureModule,
    ShippingMethodSelectorFormlyModule,
    CustomLabelFormlyModule,
    AddressSelectorFormlyModule,
    CartOrderSummaryComponent,
    TranslatePipe,
    CurrencyPipe,
  ],
  templateUrl: './cart-shipping.component.html',
  styleUrl: './cart-shipping.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartShippingComponent {
  readonly cartStore = inject(ecoStoreCartStore);
  readonly userProfileStore = inject(pocketBaseUserProfileStore);
  readonly tenantService = inject(EcoStoreTenantBaseService);
  readonly formValid = signal(false);
  readonly formConfig = getCartShippingFormConfig();

  onShippingMethodChange(event: Partial<EcoStoreCartState>): void {
    this.cartStore.updateLogistics(event);
  }

  onFormValidChange(isValid: boolean): void {
    this.formValid.set(isValid);
  }

  getDeliveryOffer(): number {
    const type = this.cartStore.shippingMethod() ?? 'pickup';
    const amount = this.cartStore.totalAmount();
    const offer = this.tenantService.getTenantDeliveryPriceForFreeShipping(type, amount);
    return offer > 0 ? offer : 0;
  }
}
