import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-cart-payment',
  standalone: true,
  imports: [CommonModule],
  template: '<p>Cart Payment Works!</p>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPaymentComponent {}
