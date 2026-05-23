import { Platform } from '@angular/cdk/platform';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  effect,
  inject,
  Injectable,
  Injector,
  PLATFORM_ID,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Service to manage global layout properties and side-effects based on route data.
 * Handles body overflow, scroll-to-top, and other global layout concerns.
 */
@Injectable({ providedIn: 'root' })
export class EcoStoreLayoutService {
  readonly #platformId = inject(PLATFORM_ID);
  readonly #router = inject(Router);
  readonly #document = inject(DOCUMENT);
  readonly #injector = inject(Injector);
  readonly #platform = inject(Platform);

  /**
   * Signal that triggers whenever a navigation starts.
   */
  readonly #navigationTrigger = toSignal(
    this.#router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    )
  );

  constructor() {
    if (isPlatformBrowser(this.#platformId)) {
      this.#initLayoutEffects();
    }
  }

  #initLayoutEffects(): void {
    effect(() => {
      const trigger = this.#navigationTrigger();

      if (!trigger) return;

      // Use afterNextRender to ensure the scroll happens after the view has updated.
      // We wrap it in untracked to avoid NG0602 error when scheduling render hooks inside an effect.
      untracked(() => {
        afterNextRender(
          () => {
            const content = this.#document.querySelector('.mat-sidenav-content');

            if (content) {
              // On iOS/iPad, we specifically want smooth scrolling for better UX.
              // On other platforms, we use an immediate scroll-to-top (scrollTop = 0)
              // to guarantee restoration, as behavior: 'smooth' can sometimes be inconsistent.
              content.scrollTo({ top: 0, behavior: 'smooth' });

              if (this.#platform.IOS) {
                content.scrollTop = 0;
              }
            }
            // Also handle window scroll for standalone pages
            this.#document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
          },
          { injector: this.#injector }
        );
      });
    });
  }
}
