import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-cart-shipping',
  standalone: true,
  imports: [CommonModule],
  template: '<p>Cart Shipping Works!</p>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartShippingComponent {}
