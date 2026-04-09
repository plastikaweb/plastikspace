import { Injectable } from '@angular/core';
import { PocketBaseCrudService } from '@plastik/core/api-pocketbase';
import { PocketBaseUserAddress } from '@plastik/core/entities';

@Injectable({
  providedIn: 'root',
})
export class PocketBaseUserAddressService extends PocketBaseCrudService<PocketBaseUserAddress> {
  protected collectionName(): string {
    return 'user_addresses';
  }
}
