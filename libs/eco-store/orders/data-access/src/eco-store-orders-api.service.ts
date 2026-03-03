import { Injectable } from '@angular/core';
import { EcoStoreCrudService } from '@plastik/eco-store/api';
import { EcoStoreOrder } from '@plastik/eco-store/entities';

@Injectable({
  providedIn: 'root',
})
export class EcoStoreOrdersApiService extends EcoStoreCrudService<EcoStoreOrder> {
  protected override collectionName(): string {
    return 'orders';
  }
}
