import { Injectable } from '@angular/core';
import { PocketBaseGetService } from '@plastik/core/api-pocketbase';
import { ProductCategoryStats } from '@plastik/eco-store/entities';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductCategoriesStatsService extends PocketBaseGetService<ProductCategoryStats> {
  protected collectionName(): string {
    return 'product_categories_stats';
  }
}
