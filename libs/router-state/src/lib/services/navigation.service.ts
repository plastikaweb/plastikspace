import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { NavigationProps } from '../navigation';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private history: string[] = [];

  constructor(private readonly router: Router, private readonly location: Location) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.history = [event.urlAfterRedirects, ...this.history];
      }
    });
  }
  /**
   * Navigate to a concrete URL with params and extras if needed.
   * @param { path, query, extras } The navigation configuration properties.
   */
  navigate({ path, query, extras }: NavigationProps): void {
    this.router.navigate(path, { queryParams: query, ...extras });
  }

  /**
   * Go back to previous URL.
   * @param backBaseUrl The default back URL. Use it when we have no navigation history.
   * @param regex An instruction to accomplish when we want to redirect to an specific previous URL that must satisfy the regex pattern.
   */
  back(backBaseUrl?: string, regex?: RegExp): void {
    if (this.history.length && regex) {
      this.history.shift();
      for (const url of this.history) {
        if (regex.test(url)) {
          this.router.navigateByUrl(url);
          return;
        }
      }
      // If no match for previous URL is found, redirect to default one or previous one.
      backBaseUrl ? this.router.navigateByUrl(backBaseUrl || '/') : this.location.back();
      return;
    } else if (backBaseUrl) {
      this.router.navigateByUrl(backBaseUrl || '/');
    } else {
      this.location.back();
    }
  }
}
