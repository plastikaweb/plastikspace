import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  EcoStoreProductWithCategoryName,
  ProductCategory,
  SortConfig,
} from '@plastik/eco-store/entities';
import { EcoStoreProductCardComponent } from '@plastik/eco-store/product-card';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { activityStore } from '@plastik/shared/activity/data-access';
import { PaginationComponent } from '@plastik/shared/pagination/ui';
import { PocketbasePaginationNavigationDirective } from '@plastik/shared/pagination/util';
import { SortSelectorComponent } from '@plastik/shared/sort-selector';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'eco-store-products-feature',
  standalone: true,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcoStoreProductsFeatureComponent {
  protected productsStore = inject(ecoStoreProductsStore);
  protected activityStore = inject(activityStore);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #categoriesStore = inject(ecoStoreProductCategoriesStore);

  readonly categorySlug = toSignal<string | null>(
    this.#route.paramMap.pipe(
      map(params => params.get('category')),
      distinctUntilChanged()
    )
  );

  readonly category = computed<(Pick<ProductCategory, 'icon'> & { name: string }) | null>(() => {
    const slug = this.categorySlug() ?? null;
    return this.#categoriesStore.getCategoryBySlug(slug, 'products.all');
  });

  addToCart({ id, quantity }: { id: EcoStoreProductWithCategoryName['id']; quantity: number }) {
    // TODO: Implement add to cart functionality
    void id;
    void quantity;
  }

  toggleFavorite(id: EcoStoreProductWithCategoryName['id']) {
    // TODO: Implement toggle favorite functionality
    void id;
  }

  sortProducts(sort: SortConfig) {
    this.#router.navigate([], {
      queryParams: { ...sort, page: 0 },
      queryParamsHandling: 'merge',
    });
  }
}
