import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import { EntityFireService } from '@plastik/shared/signal-state-data-access';

import { StoreCategoryFilter } from './category-store';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryFireService extends EntityFireService<LlecoopProductCategory> {
  protected readonly path = 'category';

  override getFilterConditions(filter: StoreCategoryFilter): QueryConstraint[] {
    const conditions: QueryConstraint[] = [];

    if (Object.entries(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        if (key === 'text' && value) {
          const normalizedText = latinize(value as string).toLowerCase();
          conditions.push(
            where('normalizedName', '>=', normalizedText),
            where('normalizedName', '<=', normalizedText + '\uf8ff')
          );
        }
      });
    }

    return conditions;
  }
}
