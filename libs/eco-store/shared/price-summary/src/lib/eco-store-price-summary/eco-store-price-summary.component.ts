import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreTenantLogisticsDeliveryType } from '@plastik/eco-store/entities';
import { SharedAlertUiComponent } from '@plastik/shared/alert/ui';

@Component({
  selector: 'eco-store-price-summary',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    SharedAlertUiComponent,
    TranslateModule,
  ],
  templateUrl: './eco-store-price-summary.component.html',
  styleUrl: './eco-store-price-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStorePriceSummaryComponent {
  readonly #router = inject(Router);
  readonly submitAvailable = input<boolean>(true);
  readonly subtotal = input.required<number>();
  readonly taxes = input.required<number>();
  readonly total = input.required<number>();
  readonly shipping = input<number>(0);
  readonly actionButtonText = input<string>('');
  readonly actionRoute = input<string[]>();
  readonly actionClick = output<void>();
  readonly deliveryType = input<EcoStoreTenantLogisticsDeliveryType>('pickup');
  readonly isStoreOpen = input<boolean>(true);
  readonly nextOpenDate = input<Date | null>(null);
  readonly isTrialExpired = input<boolean>(false);
  readonly trialExpiredClick = output<void>();

  protected handleAction() {
    if (this.isTrialExpired()) {
      this.trialExpiredClick.emit();

      return;
    }

    const route = this.actionRoute();

    if (route) {
      this.#router.navigate(route);
    } else {
      this.actionClick.emit();
    }
  }
}
