import { computed, DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { of, switchMap, takeWhile, timer } from 'rxjs';
import { Countdown, CountdownConfig, CountdownData } from './countdown.model';

/**
 * Shared countdown service that provides reactive countdown signals.
 * Can be used across different apps and components.
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private countdownService = inject(CountdownService);
 *
 *   countdown = this.countdownService.createCountdown(
 *     () => this.targetDateSignal(),  // target date signal
 *     { intervalMs: 60000 }           // optional config
 *   );
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CountdownService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  private readonly separator = signal<string>(':');

  /**
   * Creates a reactive countdown to a target date.
   *
   * @param targetDateFn - Function that returns the target Date or null
   * @param config - Optional configuration
   * @param separator - Separator for time parts
   * @returns Object with countdown signals
   */
  createCountdown(
    targetDateFn: () => Date | null,
    config: CountdownConfig = {},
    separator = ':'
  ): Countdown {
    const intervalMs = config.intervalMs ?? 1000;
    const now = signal(new Date());
    this.separator.set(separator);

    const targetDateSignal = computed(() => targetDateFn());

    toObservable(targetDateSignal, { injector: this.injector })
      .pipe(
        switchMap(targetDate => {
          if (!targetDate || targetDate.getTime() <= new Date().getTime()) {
            return of(null);
          }
          return timer(0, intervalMs).pipe(
            takeWhile(() => targetDate.getTime() > new Date().getTime(), true)
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(tick => {
        if (tick !== null) {
          now.set(new Date());
        }
      });

    const data = computed<CountdownData | null>(() => {
      const target = targetDateSignal();
      const current = now();

      if (!target) return null;

      const diffMs = target.getTime() - current.getTime();
      if (diffMs <= 0) return null;

      return this.calculateCountdown(diffMs);
    });

    const text = computed(() => {
      const countdown = data();
      return countdown ? this.formatCountdown(countdown) : '';
    });

    const isExpired = computed(() => {
      const target = targetDateSignal();
      if (!target) return false;
      return now().getTime() >= target.getTime();
    });

    return { data, text, isExpired };
  }

  /**
   * Calculates countdown from milliseconds difference.
   *
   * @param diffMs - Difference in milliseconds
   * @returns Countdown data object
   */
  calculateCountdown(diffMs: number): CountdownData {
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  /**
   * Format countdown to compact text (e.g., "2d 5h 30m 45s").
   *
   * @param countdown - Countdown data object
   * @returns Formatted string
   */
  formatCountdown(countdown: CountdownData): string {
    const parts: string[] = [];

    if (countdown.days > 0) parts.push(`${countdown.days}d`);
    if (countdown.hours > 0) parts.push(`${countdown.hours}h`);
    if (countdown.minutes > 0) parts.push(`${countdown.minutes}m`);
    parts.push(`${countdown.seconds}s`);

    return parts.join(this.separator());
  }
}
