import { Injectable } from '@angular/core';
import { PocketBaseGetService } from '@plastik/core/api-pocketbase';
import { EcoStoreProduct, EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { PocketBaseListParams } from '@plastik/signal-state/pocketbase';
import { ListResult, RecordListOptions, RecordOptions } from 'pocketbase';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductsApiService extends PocketBaseGetService<EcoStoreProduct> {
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

    const { category } = rest as {
      category?: string;
    };

    const filterParts: string[] = [];

    if (category) {
      filterParts.push(`category = "${category}"`);
    }

    const filter: string | undefined =
      filterParts.length > 0 ? filterParts.join(' && ') : undefined;

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
    return super
      .getFullList({
        filter: `normalizedName = "${slug}"`,
      })
      .pipe(map(products => products[0] || null));
  }
}
