import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SharedAlertUiComponent } from '@plastik/shared/alert/ui';

@Component({
  selector: 'eco-new-price-warning',
  imports: [CurrencyPipe, SharedAlertUiComponent, TranslatePipe],
  templateUrl: './new-price-warning.component.html',
  styleUrl: './new-price-warning.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPriceWarningComponent {
  readonly currentPrice = input.required<number>();
  readonly oldPrice = input.required<number>();

  readonly isPriceDrop = computed(() => this.currentPrice() < this.oldPrice());
}
