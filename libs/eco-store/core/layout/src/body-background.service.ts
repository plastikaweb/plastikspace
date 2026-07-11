import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BodyBackgroundService {
  readonly #platformId = inject(PLATFORM_ID);
  readonly #document = inject(DOCUMENT);
  readonly #renderer = inject(RendererFactory2).createRenderer(null, null);
  readonly #router = inject(Router);

  /**
   * Signal that extracts the first URL segment (e.g., 'botiga', 'comandes').
   */
  readonly #firstSegment = toSignal(
    this.#router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => (event.urlAfterRedirects || event.url).split('/')[1]?.split('?')[0])
    ),
    { initialValue: this.#router.url.split('/')[1]?.split('?')[0] }
  );

  #lastClass = '';

  constructor() {
    if (isPlatformBrowser(this.#platformId)) {
      effect(() => {
        const segment = this.#firstSegment();

        // Remove the previous class if it exists
        if (this.#lastClass) {
          this.#renderer.removeClass(this.#document.body, this.#lastClass);
        }

        // Apply the new class based on the current segment
        if (segment) {
          this.#lastClass = `bg-${segment}`;
          this.#renderer.addClass(this.#document.body, this.#lastClass);
        }
      });
    }
  }
}
