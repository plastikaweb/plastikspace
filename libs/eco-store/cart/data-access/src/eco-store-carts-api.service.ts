import { Injectable } from '@angular/core';
import { EcoStoreCrudService } from '@plastik/eco-store/api';
import { EcoStoreCart } from '@plastik/eco-store/entities';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreCartsApiService extends EcoStoreCrudService<EcoStoreCart> {
  protected override collectionName(): string {
    return 'carts';
  }
}
