import { Injectable } from '@angular/core';
import { EcoStoreGetService } from '@plastik/eco-store/api';
import { EcoStoreProduct, EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { injectIsBuildTimeRender } from '@plastik/eco-store/tenant';
import { PocketBaseListParams } from '@plastik/signal-state/pocketbase';
import { ListResult, RecordListOptions } from 'pocketbase';
import { map, NEVER, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductsApiService extends EcoStoreGetService<EcoStoreProduct> {
  readonly #isBuildTimeRender = injectIsBuildTimeRender();

  protected override collectionName(): string {
    return 'products';
  }

  /**
   * @description Get a filtered list of products, applying category filter when present.
   * @param { PocketBaseListParams } params The list parameters from the store (page, perPage, sort, filter, etc.).
   * @returns { Observable<ListResult<EcoStoreProduct>> } The filtered list of products.
   */
  override getList(params: PocketBaseListParams = {}): Observable<ListResult<EcoStoreProduct>> {
    const { page, perPage, sort, filter: filterObj } = params;

    // No tenant: `tenant ="undefined"` can only list nothing, so PocketBase is not asked. At build
    // time (the prerender of `/botiga`, TECH-18) the list stays loading, as the prerendered page
    // showed while that request was in flight; in the browser it is empty.
    if (!this.tenantStore.tenant()?.id) {
      return this.#isBuildTimeRender
        ? NEVER
        : of({ page: page ?? 1, perPage: perPage ?? 0, totalItems: 0, totalPages: 0, items: [] });
    }

    const filter = [this.filter, filterObj].filter(Boolean).join(' && ');

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
    const filter = `normalizedName ="${slug}" && ${this.filter}`;

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
    return `tenant ="${this.tenantStore.tenant()?.id}"`;
  }
}
