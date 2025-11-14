import { Injectable } from '@angular/core';
import { PocketBaseGetAllService } from '@plastik/core/api';
import { ProductCategory } from '@plastik/eco-store/entities';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductCategoriesApiService extends PocketBaseGetAllService<ProductCategory> {
  protected override collectionName(): string {
    return 'productCategories';
  }
}
