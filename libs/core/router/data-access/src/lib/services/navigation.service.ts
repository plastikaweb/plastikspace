import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { NavigationProps } from '../navigation';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly #router = inject(Router);
  readonly #location = inject(Location);
  #history: string[] = [];

  constructor() {
    this.#router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.#history = [event.urlAfterRedirects, ...this.#history];
      }
    });
  }
  /**
   * @description Navigate to a concrete URL with params and extras if needed.
   * @param { NavigationProps } navigationProps The navigation configuration properties.
   */
  navigate({ path, extras }: NavigationProps): void {
    this.#router.navigate(path, { queryParams: extras?.queryParams, fragment: extras?.fragment });
  }

  /**
   * @description Go back to previous URL.
   * @param {string} backBaseUrl The default back URL. Use it when we have no navigation history.
   * @param {RegExp} regex An instruction to accomplish when we want to redirect to an specific previous URL that must satisfy the regex pattern.
   */
  back(backBaseUrl?: string, regex?: RegExp): void {
    if (this.#history.length && regex) {
      this.#history.shift();
      for (const url of this.#history) {
        if (regex.test(url)) {
          this.#router.navigateByUrl(url);
          return;
        }
      }
    }

    if (backBaseUrl) {
      this.#router.navigateByUrl(backBaseUrl || '/');
    } else {
      this.#location.back();
    }
  }
}
