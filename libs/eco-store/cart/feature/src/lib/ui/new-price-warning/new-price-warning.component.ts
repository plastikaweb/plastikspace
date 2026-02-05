import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'eco-new-price-warning',
  imports: [CurrencyPipe, MatIcon, TranslatePipe],
  templateUrl: './new-price-warning.component.html',
  styleUrl: './new-price-warning.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPriceWarningComponent {
  currentPrice = input.required<number>();
  oldPrice = input.required<number>();

  isPriceDrop = computed(() => this.currentPrice() < this.oldPrice());
}
