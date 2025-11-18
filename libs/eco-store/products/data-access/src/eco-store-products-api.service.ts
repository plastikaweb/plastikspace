import { Injectable } from '@angular/core';
import { PocketBaseGetAllService } from '@plastik/core/api';
import { Product } from '@plastik/eco-store/entities';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductsApiService extends PocketBaseGetAllService<Product> {
  protected override collectionName(): string {
    return 'products';
  }
}
