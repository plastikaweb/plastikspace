import { Component, computed, inject, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { EcoStoreTenantWindowStatus } from '@plastik/eco-store/entities';
import { SharedCountdownUiComponent } from '@plastik/shared/countdown';
import { CountdownService } from '@plastik/shared/countdown/util';

@Component({
  selector: 'eco-store-store-window',
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    TranslatePipe,
    SharedCountdownUiComponent,
  ],
  templateUrl: './store-window.component.html',
  styleUrl: './store-window.component.scss',
})
export class StoreWindowComponent {
  readonly #countdownService = inject(CountdownService);

  readonly status = input<EcoStoreTenantWindowStatus>();
  readonly nextOpenDate = input<Date | null>();
  readonly is24h = input<boolean>();
  readonly closedReason = input<string | null>();

  readonly #countdown = this.#countdownService.createCountdown(() => this.nextOpenDate() || null);

  readonly #countdownText = this.#countdown.text;

  protected statusConfig = computed(() => {
    const status = this.status();
    const is24h = this.is24h();
    const countdownText = this.#countdownText();

    const segments = countdownText
      ? countdownText
          .split(/(:)/)
          .filter(Boolean)
          .map(segment => segment.trim())
      : [];

    if (status === 'CLOSING_SOON') {
      return {
        class: 'closing',
        icon: 'schedule',
        label: 'store.status.closingSoon',
        countdownSegments: segments,
      };
    }

    if (status === 'OPENING_SOON') {
      return {
        class: 'soon',
        icon: 'schedule',
        label: 'store.status.openingSoon',
        countdownSegments: segments,
      };
    }

    if (status === 'CLOSED_MANUALLY') {
      return {
        class: 'closed',
        icon: 'lock_clock',
        label: 'store.status.closedManually',
      };
    }

    if (status === 'CLOSED') {
      return {
        class: 'closed',
        icon: 'lock_clock',
        label: 'store.status.closed',
        countdownSegments: segments,
        countdownPrefix: 'store.status.opensIn',
      };
    }

    if (status === 'CANCELLED') {
      return {
        class: 'closed',
        icon: 'block',
        label: 'store.status.cancelled',
      };
    }

    if (is24h) {
      return {
        class: 'open',
        icon: 'local_convenience_store',
        label: 'store.status.open24h',
      };
    }

    if (status === 'OPEN') {
      return {
        class: 'open',
        icon: 'store_front',
        label: 'store.status.open',
      };
    }

    return null;
  });
}
