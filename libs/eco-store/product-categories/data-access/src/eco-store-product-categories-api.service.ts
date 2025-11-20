import { Injectable } from '@angular/core';
import { PocketBaseGetAllService } from '@plastik/core/api';
import { ProductCategory } from '@plastik/eco-store/entities';
import { RecordFullListOptions } from 'pocketbase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductCategoriesApiService extends PocketBaseGetAllService<ProductCategory> {
  protected override collectionName(): string {
    return 'product_categories';
  }

  override getFullList(params: RecordFullListOptions = {}): Observable<ProductCategory[]> {
    return super.getFullList({
      ...params,
      expand: 'group',
      sort: '+group.id',
    });
  }
}
