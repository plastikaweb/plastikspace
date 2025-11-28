import { Injectable } from '@angular/core';
import { PocketBaseGetService } from '@plastik/core/api-pocketbase';
import { Product } from '@plastik/eco-store/entities';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductsApiService extends PocketBaseGetService<Product> {
  protected override collectionName(): string {
    return 'products';
  }
}
