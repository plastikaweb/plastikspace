import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreCategoryProductTitleService {
  /**
   * @description Resolve the route title for a product details page using a reactive key.
   * The actual name lookup is handled by EcoStorePrefixTitleService using Signals.
   * @param {ActivatedRouteSnapshot} route The current route snapshot.
   * @returns {string} A reactive key containing the product slug.
   */
  resolve(route: ActivatedRouteSnapshot): string {
    const productSlug: string | null = route.paramMap.get('slug');
    if (!productSlug) {
      return 'products.details';
    }

    return `PRODUCT_TITLE:${productSlug}`;
  }
}
