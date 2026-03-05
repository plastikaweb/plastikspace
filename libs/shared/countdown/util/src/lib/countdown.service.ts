import { computed, DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { of, switchMap, takeWhile, timer } from 'rxjs';
import { Countdown, CountdownConfig, CountdownData } from './countdown.model';

/**
 * Shared countdown service that provides reactive countdown signals.
 * Can be used across different apps and components.
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

  // Cache to store shared countdowns by target date
  private readonly countdownCache = new Map<string, Countdown>();

  private readonly separator = signal<string>(':');

  /**
   * @description Creates a reactive countdown to a target date.
   * @param {() => Date | null} targetDateFn - Function that returns the target Date or null.
   * @param {CountdownConfig} config - Optional configuration.
   * @param {string} separator - Separator for time parts.
   * @param {Injector} injector - Optional injector to tie the countdown lifecycle to a component.
   * @returns {Countdown} Object with countdown signals.
   */
  createCountdown(
    targetDateFn: () => Date | null,
    config: CountdownConfig = {},
    separator = ':',
    injector?: Injector
  ): Countdown {
    const intervalMs = config.intervalMs ?? 1000;
    const targetInjector = injector ?? this.injector;
    const targetDestroyRef = targetInjector.get(DestroyRef);

    this.separator.set(separator);

    const targetDateSignal = computed(() => targetDateFn());

    // Create a cache key based on the target date and interval
    const cacheKey = computed(() => {
      const targetDate = targetDateSignal();
      return targetDate ? `${targetDate.getTime()}-${intervalMs}` : 'null';
    });

    // Check if we already have a countdown for this target date
    let countdown = this.countdownCache.get(cacheKey());

    if (!countdown) {
      // Create new countdown if not cached
      countdown = this.createCountdownInternal(
        targetDateSignal,
        intervalMs,
        targetInjector,
        targetDestroyRef
      );
      this.countdownCache.set(cacheKey(), countdown);
    }

    return countdown;
  }

  /**
   * @description Internal method to create a new countdown instance.
   * @param {() => Date | null} targetDateSignal - Signal that returns the target Date or null.
   * @param {number} intervalMs - Interval in milliseconds.
   * @param {Injector} targetInjector - Injector to tie the countdown lifecycle to a component.
   * @param {DestroyRef} targetDestroyRef - DestroyRef to tie the countdown lifecycle to a component.
   * @returns {Countdown} Countdown object with signals.
   */
  private createCountdownInternal(
    targetDateSignal: () => Date | null,
    intervalMs: number,
    targetInjector: Injector,
    targetDestroyRef: DestroyRef
  ): Countdown {
    const now = signal(new Date());

    toObservable(computed(targetDateSignal), { injector: targetInjector })
      .pipe(
        switchMap(targetDate => {
          if (!targetDate || targetDate.getTime() <= new Date().getTime()) {
            return of(null);
          }
          return timer(0, intervalMs).pipe(
            takeWhile(() => targetDate.getTime() > new Date().getTime(), true)
          );
        }),
        takeUntilDestroyed(targetDestroyRef)
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
   * @description Calculates countdown from milliseconds difference.
   * @param {number} diffMs - Difference in milliseconds.
   * @returns {CountdownData} Countdown data object.
   */
  calculateCountdown(diffMs: number): CountdownData {
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  /**
   * @description Format countdown to compact text (e.g., "2d 5h 30m 45s").
   * @param {CountdownData} countdown - Countdown data object.
   * @returns {string} Formatted string.
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
