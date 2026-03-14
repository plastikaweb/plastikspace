import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SortConfig } from '@plastik/core/entities';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreProductWithCategoryName, ProductCategory } from '@plastik/eco-store/entities';
import { EcoStoreProductCardComponent } from '@plastik/eco-store/product-card';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import {
  ecoStoreProductsStore,
  ProductsPocketBaseFilter,
} from '@plastik/eco-store/products/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { PaginationComponent } from '@plastik/pagination/ui';
import { PocketbasePaginationNavigationDirective } from '@plastik/pagination/util';
import { activityStore } from '@plastik/shared/activity/data-access';
import { ViewTransitionService } from '@plastik/shared/util/view-transition';
import { SortSelectorComponent } from '@plastik/sort-selector';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'eco-store-products-feature',
  imports: [
    TranslateModule,
    EcoStoreProductCardComponent,
    PaginationComponent,
    PocketbasePaginationNavigationDirective,
    SortSelectorComponent,
    MatIcon,
  ],
  templateUrl: './eco-store-products-feature.component.html',
  styleUrl: './eco-store-products-feature.component.scss',
  host: {
    role: 'region',
    class: 'flex flex-1 flex-col px-4 py-8',
    '[attr.aria-busy]': 'productsStore.isLoading()',
    '[attr.inert]': 'productsStore.isLoading()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcoStoreProductsFeatureComponent {
  protected readonly productsStore = inject(ecoStoreProductsStore);
  protected readonly activityStore = inject(activityStore);
  protected readonly cartStore = inject(ecoStoreCartStore);
  protected readonly tenantStore = inject(ecoStoreTenantStore);
  protected readonly viewTransitionService = inject(ViewTransitionService);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #categoriesStore = inject(ecoStoreProductCategoriesStore);

  /** Computes the array length for skeleton loaders based on the current active category total or default pagination size. */
  protected readonly skeletonItems = linkedSignal({
    source: () => ({
      isLoading: this.productsStore.isLoading(),
      perPage: this.productsStore.getPagination().perPage,
      page: this.productsStore.getPagination().page,
      category: (this.productsStore.filter() as ProductsPocketBaseFilter).category,
      entities: this.#categoriesStore.entities(),
      totalProducts: this.#categoriesStore.totalProducts(),
    }),
    computation: s => {
      if (s.isLoading) {
        const selectedCategoryCount = s.category
          ? s.entities.find(c => c.category === s.category)?.totalProducts || 0
          : s.totalProducts;

        const remaining = selectedCategoryCount - s.page * s.perPage;
        const count = Math.max(0, Math.min(s.perPage, remaining));
        return Array(count).fill(0);
      }
      return [];
    },
  });

  /** The current category slug derived from route parameters. */
  readonly categorySlug = toSignal<string | null>(
    this.#route.paramMap.pipe(
      map(params => params.get('category')),
      distinctUntilChanged()
    )
  );

  /** The current category information including translated name and icon. */
  readonly category = computed<(Pick<ProductCategory, 'icon'> & { name: string }) | null>(() => {
    const slug = this.categorySlug() ?? null;
    return this.#categoriesStore.getCategoryBySlug(slug, 'products.all');
  });

  /**
   * Adds a product to the cart with the specified quantity.
   * @param { object } params The product and quantity to add.
   */
  addToCart({ product, quantity }: { product: EcoStoreProductWithCategoryName; quantity: number }) {
    this.cartStore.addToCart(product, quantity);
  }

  /**
   * Toggles the favorite status of a product.
   * @param { string } id The ID of the product.
   */
  toggleFavorite(id: EcoStoreProductWithCategoryName['id']) {
    // TODO: Implement toggle favorite functionality
    void id;
  }

  /**
   * Navigates to the product list with updated sorting parameters.
   * @param { SortConfig } sort The new sort configuration.
   */
  sortProducts(sort: SortConfig) {
    this.#router.navigate([], {
      queryParams: { ...sort, page: 0 },
      queryParamsHandling: 'merge',
    });
  }
}
