import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eco-cart-confirmation',
  imports: [CommonModule],
  template: '<p>Cart Confirmation Works!</p>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartConfirmationComponent {}
