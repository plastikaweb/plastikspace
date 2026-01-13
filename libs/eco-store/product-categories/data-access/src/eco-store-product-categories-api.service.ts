import { Injectable } from '@angular/core';
import { ProductCategory } from '@plastik/eco-store/entities';
import { RecordFullListOptions } from 'pocketbase';
import { Observable } from 'rxjs';
import { EcoStoreGetAllService } from '@plastik/eco-store/api';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductCategoriesApiService extends EcoStoreGetAllService<ProductCategory> {
  protected override collectionName(): string {
    return 'product_categories';
  }

  override getFullList(params: RecordFullListOptions = {}): Observable<ProductCategory[]> {
    const filter = this.tenantFilter;

    return super.getFullList({
      ...params,
      filter,
      expand: 'group',
      sort: '+group.id',
    });
  }

  get tenantFilter(): string {
    return `tenant = "" || tenant = "${this.tenantService.tenant()?.id}"`;
  }
}
