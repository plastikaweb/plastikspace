import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalizedFields } from '@plastik/core/entities';
import { ProductCategory } from '@plastik/eco-store/entities';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreCategoryRouteTitleService {
  readonly #categoriesStore = inject(ecoStoreProductCategoriesStore);
  readonly #translateService = inject(TranslateService);

  /**
   * @description Resolve the route title for product category pages based on the current language.
   * @param {ActivatedRouteSnapshot} route The current route snapshot.
   * @returns {string} The localized category name or a generic fallback key.
   */
  resolve(route: ActivatedRouteSnapshot): string {
    const categorySlug: string | null = route.paramMap.get('category');
    if (!categorySlug) {
      return 'products.category';
    }
    const categories: ProductCategory[] = this.#categoriesStore.categories();
    const category: ProductCategory | undefined = categories.find(
      (item: ProductCategory) => item.normalizedName === categorySlug
    );
    if (!category || !category.name) {
      return 'products.category';
    }
    const name: string | LocalizedFields<string> = category.name;
    if (typeof name === 'string') {
      return name;
    }
    const currentLang: string = this.#translateService.getCurrentLang();
    const localizedName: string | undefined =
      name[currentLang as keyof LocalizedFields<string>] ?? name['ca'];
    return localizedName ?? 'products.category';
  }
}
