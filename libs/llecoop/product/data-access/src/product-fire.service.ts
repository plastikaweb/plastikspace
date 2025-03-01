import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import { EntityFireService } from '@plastik/shared/signal-state-data-access';

import { StoreProductFilter } from './product-store';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductFireService extends EntityFireService<LlecoopProduct> {
  protected readonly path = 'product';

  override getFilterConditions(filter: StoreProductFilter): QueryConstraint[] {
    const conditions: QueryConstraint[] = [];

    if (Object.entries(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        if (key === 'text' && value) {
          const normalizedText = latinize(value as string).toLowerCase();
          conditions.push(
            where('normalizedName', '>=', normalizedText),
            where('normalizedName', '<=', normalizedText + '\uf8ff')
          );
        } else if (key === 'category' && value !== 'all') {
          conditions.push(where('categoryRef', '==', value));
        } else if (key === 'inStock' && value !== 'all') {
          conditions.push(where('isAvailable', '==', value));
        }
      });
    }

    return conditions;
  }
}
