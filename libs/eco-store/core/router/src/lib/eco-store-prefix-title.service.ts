import { inject, Injectable, Injector } from '@angular/core';
import { PrefixTitleService } from '@plastik/core/router-state';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

@Injectable({
  providedIn: 'root',
})
export class EcoStorePrefixTitleService extends PrefixTitleService {
  readonly #injector = inject(Injector);

  /**
   * @description Resolve the title using TranslateService or Signal-based lookup.
   * @param {string | undefined} title The raw route title.
   * @returns {string | undefined} The translated name.
   */
  protected override getTranslatedTitle(title: string | undefined): string | undefined {
    if (title?.startsWith('CATEGORY_TITLE:')) {
      const slug = title.split(':')[1];
      const categoriesStore = this.#injector.get(ecoStoreProductCategoriesStore);
      const category = categoriesStore.findCategoryBySlug(slug);
      return category ? categoriesStore.getLocalizedCategoryName(category) : undefined;
    }

    if (title?.startsWith('PRODUCT_TITLE:')) {
      const slug = title.split(':')[1];
      const productsStore = this.#injector.get(ecoStoreProductsStore);
      return productsStore.findProductBySlug()(slug)?.name;
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
    const tenantStore = this.#injector.get(ecoStoreTenantStore);
    const prefix = tenantStore.tenant()?.name || this.environment.name;

    if (!title) {
      return `${prefix}`;
    }
    return `${prefix} - ${title}`;
  }
}
