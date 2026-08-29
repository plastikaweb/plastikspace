import { formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AlertType } from '@plastik/core/entities';
import { EcoStoreTenantWindowStatus } from '@plastik/eco-store/entities';
import { SharedAlertUiComponent } from '@plastik/shared/alert/ui';
import { SharedCountdownUiComponent } from '@plastik/shared/countdown';
import { CountdownService } from '@plastik/shared/countdown/util';

const STATUS_ALERT_TYPE: Record<EcoStoreTenantWindowStatus, AlertType> = {
  OPEN: 'SUCCESS',
  CLOSING_SOON: 'WARNING',
  OPENING_SOON: 'INFO',
  CLOSED: 'INFO',
  CLOSED_MANUALLY: 'INFO',
  CANCELLED: 'ERROR',
};

const STATUS_ICON: Partial<Record<EcoStoreTenantWindowStatus, string>> = {
  CLOSED: 'lock_clock',
  OPENING_SOON: 'hourglass_top',
  CLOSING_SOON: 'schedule',
  CLOSED_MANUALLY: 'lock',
  CANCELLED: 'cancel',
};

@Component({
  selector: 'eco-store-status-banner',
  imports: [SharedAlertUiComponent, SharedCountdownUiComponent, TranslateModule],
  templateUrl: './store-status-banner.component.html',
  styleUrls: ['./store-status-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreStatusBannerComponent {
  readonly #countdownService = inject(CountdownService);

  readonly status = input<EcoStoreTenantWindowStatus>('OPEN');
  readonly nextOpenDate = input<Date | null>(null);
  readonly closedReason = input<string | null>(null);
  readonly dismiss = output<void>();

  readonly #locale = inject(LOCALE_ID);
  readonly #countdown = this.#countdownService.createCountdown(() => this.nextOpenDate() || null);

  readonly segments = computed(() =>
    this.#countdown
      .text()
      .split(/(:)/)
      .filter(Boolean)
      .map(segment => segment.trim())
  );

  protected readonly alertType = computed(() => STATUS_ALERT_TYPE[this.status()]);

  protected readonly icon = computed(() => STATUS_ICON[this.status()] ?? '');

  protected readonly hasCountdown = computed(
    () =>
      (this.status() === 'CLOSED' ||
        this.status() === 'OPENING_SOON' ||
        this.status() === 'CLOSING_SOON') &&
      this.segments().length > 0
  );

  protected readonly title = computed(() => {
    const status = this.status();

    if (status === 'CLOSED') return 'store.status.statusBanner.closedTitle';
    if (status === 'OPENING_SOON') return 'store.status.statusBanner.openingSoonTitle';
    if (status === 'CLOSING_SOON') return 'store.status.statusBanner.closingSoonTitle';
    if (status === 'CLOSED_MANUALLY') return 'store.status.statusBanner.closedManuallyTitle';
    if (status === 'CANCELLED') return 'store.status.statusBanner.cancelledTitle';

    return '';
  });

  protected readonly description = computed<{ key: string; params?: Record<string, unknown> }>(
    () => {
      const status = this.status();

      if (status === 'CLOSED' && this.nextOpenDate()) {
        const nextDate = this.nextOpenDate();

        if (!nextDate) return { key: '' };

        return {
          key: 'store.status.statusBanner.closedDescription',
          params: {
            date: formatDate(nextDate, 'shortDate', this.#locale),
            time: formatDate(nextDate, 'shortTime', this.#locale),
          },
        };
      }
      if (status === 'OPENING_SOON')
        return { key: 'store.status.statusBanner.openingSoonDescription' };
      if (status === 'CLOSING_SOON') {
        const nextDate = this.nextOpenDate();

        return {
          key: 'store.status.statusBanner.closingSoonDescription',
          params: {
            time: nextDate ? formatDate(nextDate, 'shortTime', this.#locale) : '',
          },
        };
      }
      if (status === 'CLOSED_MANUALLY') return { key: this.closedReason() || '' };
      if (status === 'CANCELLED') return { key: 'store.status.statusBanner.cancelledDescription' };

      return { key: '' };
    }
  );
}
