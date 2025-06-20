import { catchError, distinctUntilChanged, map, Observable, of, takeUntil, throwError } from 'rxjs';

import { Injectable, runInInjectionContext } from '@angular/core';
import {
  collectionData,
  DocumentData,
  query,
  QueryConstraint,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import {
  EntityFireService,
  StoreFirebaseCrudPagination,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';
import { StoreUserOrderFilter } from './user-order-cart.store';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderFireService extends EntityFireService<LlecoopUserOrder> {
  protected readonly path = 'order';

  override getAll(
    pagination: StoreFirebaseCrudPagination<LlecoopUserOrder>,
    sorting: TableSortingConfig,
    filter: StoreUserOrderFilter
  ): Observable<LlecoopUserOrder[]> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        if (!this.firestoreCollection) {
          return of([]);
        }

        const conditions: QueryConstraint[] = [
          ...this.getFilterConditions(filter),
          ...this.getSortingConditions(sorting),
          ...this.getPaginationConditions(pagination, sorting[0]),
        ];

        const q = query(this.firestoreCollection, ...conditions);
        return collectionData(q, { idField: 'id' }).pipe(
          takeUntil(this.destroy$),
          distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
          map(products => products as LlecoopUserOrder[]),
          catchError(error => this.handlePermissionError(error, []))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  override getFilterConditions(filter: StoreUserOrderFilter): QueryConstraint[] {
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

  protected override firebaseAssignTypes() {
    return {
      ...super.firebaseAssignTypes(),
      toFirestore: (doc: LlecoopUserOrder): DocumentData => ({
        ...doc,
        normalizedName: latinize(doc.name).toLowerCase(),
        createdAt: doc.createdAt ?? Timestamp.now(),
        updatedAt: Timestamp.now(),
      }),
    };
  }
}
