import { inject, Injectable } from '@angular/core';
import { PrefixTitleService } from '@plastik/core/router-state';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

@Injectable({
  providedIn: 'root',
})
export class EcoStorePrefixTitleService extends PrefixTitleService {
  readonly #tenantStore = inject(ecoStoreTenantStore);
  readonly #categoriesStore = inject(ecoStoreProductCategoriesStore);
  readonly #productsStore = inject(ecoStoreProductsStore);

  /**
   * @description Resolve the title using TranslateService or Signal-based lookup.
   * @param {string | undefined} title The raw route title.
   * @returns {string | undefined} The translated name.
   */
  protected override getTranslatedTitle(title: string | undefined): string | undefined {
    if (title?.startsWith('CATEGORY_TITLE:')) {
      const slug = title.split(':')[1];
      const category = this.#categoriesStore.findCategoryBySlug(slug);
      return category ? this.#categoriesStore.getLocalizedCategoryName(category) : undefined;
    }

    if (title?.startsWith('PRODUCT_TITLE:')) {
      const slug = title.split(':')[1];
      return this.#productsStore.findProductBySlug()(slug)?.name;
    }

    return super.getTranslatedTitle(title);
  }

  /**
   * @description Prefix the title with the current tenant name or environment application name as fallback.
   * Uses the tenant signal for automatic reactivity.
   * @param {string | undefined} title The (possibly translated) title.
   * @returns {string} The final title to set in the browser.
   */
  protected override getPrefixedTitle(title: string | undefined): string {
    const prefix = this.#tenantStore.tenant()?.name || this.environment.name;

    if (!title) {
      return `${prefix}`;
    }
    return `${prefix} - ${title}`;
  }
}
