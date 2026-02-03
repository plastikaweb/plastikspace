import { Injectable } from '@angular/core';
import { EcoStoreCart } from '@plastik/eco-store/entities';
import { EcoStoreCrudService } from '@plastik/eco-store/api';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreCartsApiService extends EcoStoreCrudService<EcoStoreCart> {
  protected override collectionName(): string {
    return 'carts';
  }
}
