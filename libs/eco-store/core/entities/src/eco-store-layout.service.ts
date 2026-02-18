import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, RendererFactory2 } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

/**
 * Service to manage global layout properties based on route data.
 */
@Injectable({ providedIn: 'root' })
export class EcoStoreLayoutService {
  readonly #router = inject(Router);
  readonly #document = inject(DOCUMENT);
  readonly #renderer = inject(RendererFactory2).createRenderer(null, null);

  readonly #bodyScrollable = toSignal(
    this.#router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.#router.routerState.root.snapshot;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return this.#getRouteData(route, 'bodyScrollable') ?? false;
      }),
      startWith(false)
    )
  );

  constructor() {
    effect(() => {
      const scrollable = this.#bodyScrollable();
      const body = this.#document.body;

      if (scrollable) {
        this.#renderer.removeClass(body, 'overflow-y-hidden');
      } else {
        this.#renderer.addClass(body, 'overflow-y-hidden');
      }
    });
  }

  /**
   * Traverse up the route tree to find data for a specific key.
   * @param {ActivatedRouteSnapshot | null} route The activated route snapshot.
   * @param {string} key The data key to search for.
   * @returns {unknown} The value associated with the key or null if not found.
   */
  #getRouteData(route: ActivatedRouteSnapshot | null, key: string): unknown {
    while (route) {
      if (route.data && route.data[key] !== undefined) {
        return route.data[key];
      }
      route = route.parent;
    }
    return null;
  }
}
