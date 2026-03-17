import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreTenantWindowStatus } from '@plastik/eco-store/entities';
import { SharedCountdownUiComponent } from '@plastik/shared/countdown';
import { CountdownService } from '@plastik/shared/countdown/util';

@Component({
  selector: 'eco-store-status-banner',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    SharedCountdownUiComponent,
    TranslateModule,
  ],
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
  private readonly locale = inject(LOCALE_ID);

  readonly #countdown = this.#countdownService.createCountdown(() => this.nextOpenDate() || null);

  readonly segments = computed(() =>
    this.#countdown
      .text()
      .split(/(:)/)
      .filter(Boolean)
      .map(segment => segment.trim())
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
            date: formatDate(nextDate, 'shortDate', this.locale),
            time: formatDate(nextDate, 'shortTime', this.locale),
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
            time: nextDate ? formatDate(nextDate, 'shortTime', this.locale) : '',
          },
        };
      }

      if (status === 'CLOSED_MANUALLY') return { key: this.closedReason() || '' };
      if (status === 'CANCELLED') return { key: 'store.status.statusBanner.cancelledDescription' };
      return { key: '' };
    }
  );

  protected readonly icon = computed(() => {
    const status = this.status();
    if (status === 'CLOSED') return 'lock_clock';
    if (status === 'OPENING_SOON') return 'hourglass_top';
    if (status === 'CLOSING_SOON') return 'schedule';
    if (status === 'CLOSED_MANUALLY') return 'lock';
    if (status === 'CANCELLED') return 'cancel';
    return '';
  });
}
