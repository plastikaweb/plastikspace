import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  effect,
  inject,
  Injectable,
  Injector,
  PLATFORM_ID,
  RendererFactory2,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

/**
 * Service to manage global layout properties and side-effects based on route data.
 * Handles body overflow, scroll-to-top, and other global layout concerns.
 */
@Injectable({ providedIn: 'root' })
export class EcoStoreLayoutService {
  readonly #platformId = inject(PLATFORM_ID);
  readonly #router = inject(Router);
  readonly #document = inject(DOCUMENT);
  readonly #renderer = inject(RendererFactory2).createRenderer(null, null);
  readonly #injector = inject(Injector);

  /**
   * Signal that tracks if the current route should allow body scrolling.
   */
  readonly #bodyScrollable = toSignal(
    this.#router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => {
        let route = this.#router.routerState.root.snapshot;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return this.#getRouteData(route, 'bodyScrollable') ?? false;
      }),
      startWith(false)
    ),
    { initialValue: false }
  );

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
    // Effect 1: Handle Body Overflow
    effect(() => {
      const scrollable = this.#bodyScrollable();
      const body = this.#document.body;

      if (scrollable) {
        this.#renderer.removeClass(body, 'overflow-y-hidden');
      } else {
        this.#renderer.addClass(body, 'overflow-y-hidden');
      }
    });

    // Effect 2: Handle Scroll to Top on Navigation
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
              content.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // Also handle window scroll for routes that allow it
            this.#document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
          },
          { injector: this.#injector }
        );
      });
    });
  }

  /**
   * @description Traverse up the route tree to find data for a specific key.
   * @param {ActivatedRouteSnapshot | null} route - The current route snapshot.
   * @param {string} key - The key to look for in the route data.
   * @returns {boolean} The value of the key if found, otherwise false.
   */
  #getRouteData(route: ActivatedRouteSnapshot | null, key: string): boolean {
    while (route) {
      if (route.data && route.data[key] !== undefined) {
        return route.data[key];
      }
      route = route.parent;
    }
    return false;
  }
}
