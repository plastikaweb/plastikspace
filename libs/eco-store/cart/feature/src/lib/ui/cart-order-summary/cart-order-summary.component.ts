import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'eco-cart-order-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, TranslatePipe, RouterLink],
  templateUrl: './cart-order-summary.component.html',
  styleUrl: './cart-order-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderSummaryComponent {
  subtotal = input.required<number>();
  taxes = input.required<number>();
  total = input.required<number>();
  shipping = input<number>(0);
  actionButtonText = input<string>('');
  actionRoute = input<string[]>();
}
