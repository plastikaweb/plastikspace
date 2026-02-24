import { Injectable } from '@angular/core';
import { PocketBaseListParams } from '@plastik/signal-state/pocketbase';
import { ListResult, RecordListOptions } from 'pocketbase';
import { map, Observable } from 'rxjs';
import { EcoStoreProduct, EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { EcoStoreGetService } from '@plastik/eco-store/api';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductsApiService extends EcoStoreGetService<EcoStoreProduct> {
  protected override collectionName(): string {
    return 'products';
  }

  /**
   * @description Get a filtered list of products, applying category filter when present.
   * @param { PocketBaseListParams } params The list parameters from the store (page, perPage, sort, filter, etc.).
   * @returns { Observable<ListResult<EcoStoreProduct>> } The filtered list of products.
   */
  override getList(params: PocketBaseListParams = {}): Observable<ListResult<EcoStoreProduct>> {
    const { page, perPage, sort, ...rest } = params;
    const { category, categorySlug } = rest as {
      category?: string;
      categorySlug?: string;
    };

    const filterParts: string[] = [];

    if (category) {
      filterParts.push(`category = "${category}"`);
    } else if (categorySlug) {
      filterParts.push(`category.normalizedName = "${categorySlug}"`);
    }

    const filter =
      filterParts.length > 0 ? `${this.filter} && ${filterParts.join(' && ')}` : this.filter;

    const options: RecordListOptions = {
      page,
      perPage,
      sort,
      filter,
    };

    return super.getList(options);
  }

  /**
   * @description Get a product by its normalized name (slug).
   * @param { string } slug The normalized name of the product.
   * @returns { Observable<EcoStoreProduct | null> } The product or null if not found.
   */
  getOneBySlug(
    slug: EcoStoreProductWithCategoryName['categorySlug']
  ): Observable<EcoStoreProduct | null> {
    const filter = `normalizedName = "${slug}" && ${this.filter}`;

    return super
      .getList({
        page: 1,
        perPage: 1,
        filter,
        requestKey: 'product_by_slug',
      })
      .pipe(map(result => result.items[0] || null));
  }

  get filter(): string {
    return `tenant = "${this.tenantStore.tenant()?.id}"`;
  }
}
