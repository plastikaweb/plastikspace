import { from, Observable } from 'rxjs';

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
import { Functions, httpsCallable, HttpsCallableResult } from '@angular/fire/functions';
import { EntityId } from '@ngrx/signals/entities';
import { FirebaseAuthService } from '@plastik/auth/util/util/firebase/data-access';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import { TableSortingConfig } from '@plastik/shared/table/entities';
import { EntityFireService, FirebaseCrudPagination } from '@plastik/signal-state/firebase';

import { StoreUserFilter } from './user-store';
import { IdType } from '@plastik/core/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserFireService extends EntityFireService<LlecoopUser> {
  protected readonly path = 'user';
  readonly #functions = inject(Functions);
  readonly #firebaseAuthService = inject(FirebaseAuthService);

  protected override getFilterConditions(filter: StoreUserFilter): QueryConstraint[] {
    const conditions: QueryConstraint[] = [];

    if (Object.entries(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        if (key === 'name' && value) {
          const normalizedText = latinize(value as string).toLowerCase();
          conditions.push(
            where('normalizedName', '>=', normalizedText),
            where('normalizedName', '<=', normalizedText + '\uf8ff')
          );
        } else if (key === 'email' && value) {
          const normalizedEmail = latinize(value as string).toLowerCase();
          conditions.push(
            where('email', '>=', normalizedEmail),
            where('email', '<=', normalizedEmail + '\uf8ff')
          );
        } else if (key === 'role' && value !== 'all') {
          conditions.push(where('isAdmin', '==', value === 'admin' ? true : false));
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
    pagination: FirebaseCrudPagination<LlecoopUser>,
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
          name: (doc.name as string) ?? doc.email,
          normalizedName: latinize((doc.name as string) ?? doc.email).toLowerCase(),
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

  override update(id: IdType<LlecoopUser>, item: Partial<LlecoopUser>) {
    this.#firebaseAuthService.updateEmail();
    return super.update(id, item);
  }

  addAdminClaim(userId: EntityId): Observable<HttpsCallableResult<unknown>> {
    const callable = httpsCallable(this.#functions, 'setUserAdminClaim');
    return from(callable(userId));
  }
}
