import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreCategoryRouteTitleService {
  /**
   * @description Resolve the route title for product category pages using a reactive key.
   * The actual name lookup is handled by EcoStorePrefixTitleService using Signals.
   * @param {ActivatedRouteSnapshot} route The current route snapshot.
   * @returns {string} A reactive key containing the category slug.
   */
  resolve(route: ActivatedRouteSnapshot): string {
    const slug: string | null = route.paramMap.get('slug');
    if (slug) {
      return `PRODUCT_TITLE:${slug}`;
    }

    const categorySlug: string | null = route.paramMap.get('category');
    if (!categorySlug) {
      return 'products.category';
    }

    return `CATEGORY_TITLE:${categorySlug}`;
  }
}
