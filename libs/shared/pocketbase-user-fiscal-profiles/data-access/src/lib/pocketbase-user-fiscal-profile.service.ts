import { Injectable } from '@angular/core';
import { PocketBaseCrudService } from '@plastik/core/api-pocketbase';
import { PocketBaseUserFiscalProfile } from '@plastik/core/entities';

/**
 * CRUD access to the user_fiscal_profiles PocketBase collection.
 */
@Injectable({
  providedIn: 'root',
})
export class PocketBaseUserFiscalProfileService extends PocketBaseCrudService<PocketBaseUserFiscalProfile> {
  protected collectionName(): string {
    return 'user_fiscal_profiles';
  }
}
