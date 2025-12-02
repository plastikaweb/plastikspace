import { Injectable } from '@angular/core';
import { PocketBaseGetService } from '@plastik/core/api-pocketbase';
import { EcoStoreProduct } from '@plastik/eco-store/entities';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreProductsApiService extends PocketBaseGetService<EcoStoreProduct> {
  protected override collectionName(): string {
    return 'products';
  }
}
