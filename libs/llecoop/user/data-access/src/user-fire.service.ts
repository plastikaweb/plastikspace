import { from } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import {
  DocumentData,
  limit,
  orderBy,
  QueryConstraint,
  startAfter,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { EntityId } from '@ngrx/signals/entities';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import {
  EntityFireService,
  StoreFirebaseCrudPagination,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { StoreUserFilter } from './user-store';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserFireService extends EntityFireService<LlecoopUser> {
  protected readonly path = 'user';
  readonly #functions = inject(Functions);

  protected override getFilterConditions(filter: StoreUserFilter): QueryConstraint[] {
    const conditions: QueryConstraint[] = [];

    if (Object.entries(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        if (key === 'name' && value) {
          const normalizedText = this.normalizeText(value as string);
          conditions.push(
            where('normalizedName', '>=', normalizedText),
            where('normalizedName', '<=', normalizedText + '\uf8ff')
          );
        } else if (key === 'email' && value) {
          const normalizedEmail = this.normalizeText(value as string);
          conditions.push(
            where('email', '>=', normalizedEmail),
            where('email', '<=', normalizedEmail + '\uf8ff')
          );
        } else if (key === 'isAdmin' && value !== 'all') {
          conditions.push(where('isAdmin', '==', value));
        }
      });
    }

    return conditions;
  }

  protected override getSortingConditions(sorting: TableSortingConfig): QueryConstraint[] {
    const [active, direction] = sorting;
    const conditions: QueryConstraint[] = [];
    conditions.push(orderBy(active, direction || 'asc'));

    if (active === 'registered' || active === 'emailVerified') {
      conditions.push(orderBy('email', direction || 'asc'));
    }

    return conditions;
  }

  protected override getPaginationConditions(
    pagination: StoreFirebaseCrudPagination<LlecoopUser>,
    activeField: string
  ): QueryConstraint[] {
    const { pageSize, pageIndex, pageLastElements } = pagination;
    const conditions: QueryConstraint[] = [];

    conditions.push(limit(pageSize));

    if (pageIndex > 0 && pageLastElements?.has(pageIndex - 1)) {
      const lastDoc = pageLastElements.get(pageIndex - 1);
      if (activeField === 'registered' || activeField === 'emailVerified') {
        conditions.push(startAfter(lastDoc?.[activeField], lastDoc?.email));
      } else {
        conditions.push(startAfter(lastDoc?.[activeField]));
      }
    }

    return conditions;
  }

  protected override firebaseAssignTypes() {
    return {
      ...super.firebaseAssignTypes(),
      toFirestore: (doc: LlecoopUser): DocumentData => {
        return {
          ...doc,
          name: doc.name || doc.email,
          normalizedName: latinize(doc.name || doc.email).toLowerCase(),
          whiteListed: doc.whiteListed ?? true,
          registered: doc.registered ?? false,
          emailVerified: doc.emailVerified ?? false,
          isAdmin: doc.isAdmin ?? false,
          createdAt: doc.createdAt ?? Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
      },
    };
  }

  addAdminClaim(userId: EntityId) {
    const callable = httpsCallable(this.#functions, 'setUserAdminClaim');
    return from(callable(userId));
  }

  private normalizeText(value: string): string {
    return latinize(value).toLowerCase();
  }
}
