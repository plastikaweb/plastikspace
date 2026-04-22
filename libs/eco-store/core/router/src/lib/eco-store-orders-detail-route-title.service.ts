import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreOrdersDetailRouteTitleService {
  /**
   * @description Resolve the route title for product category pages using a reactive key.
   * The actual name lookup is handled by EcoStorePrefixTitleService using Signals.
   * @param {ActivatedRouteSnapshot} route The current route snapshot.
   * @returns {string} A reactive key containing the category slug.
   */
  resolve(route: ActivatedRouteSnapshot): string {
    const id: string | null = route.paramMap.get('id');
    if (id) {
      return `ORDER_TITLE:${id}`;
    }
    return 'orders.detail';
  }
}
