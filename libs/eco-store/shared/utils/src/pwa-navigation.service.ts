import { BreakpointObserver } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PwaNavigationService {
  protected readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly platform = inject(Platform);

  /**
   * @description Detect if the application is running in standalone mode (PWA).
   * It also includes a fallback for older iOS versions.
   */
  readonly isStandalone = toSignal(
    this.breakpointObserver.observe('(display-mode: standalone)').pipe(
      map(result => {
        const isIosStandalone =
          this.platform.IOS &&
          typeof window !== 'undefined' &&
          'standalone' in window.navigator &&
          window.navigator['standalone'];
        return result.matches || isIosStandalone;
      })
    ),
    { initialValue: false }
  );
}
