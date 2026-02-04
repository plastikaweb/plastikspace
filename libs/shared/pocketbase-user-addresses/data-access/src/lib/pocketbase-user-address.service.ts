import { Injectable } from '@angular/core';
import { PocketBaseGetService } from '@plastik/core/api-pocketbase';
import { PocketBaseUserAddress } from '@plastik/core/entities';

@Injectable({
  providedIn: 'root',
})
export class PocketBaseUserAddressService extends PocketBaseGetService<PocketBaseUserAddress> {
  protected collectionName(): string {
    return 'user_addresses';
  }

  protected requestKey(): string {
    return 'user_addresses';
  }
}
