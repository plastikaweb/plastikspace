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
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import {
  EntityFireService,
  StoreFirebaseCrudPagination,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { StoreUserOrderProductProductFilter } from './user-order-product-store';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderProductFireService extends EntityFireService<LlecoopProduct> {
  protected readonly path = 'product';

  override getAll(
    pagination: StoreFirebaseCrudPagination<LlecoopProduct>,
    sorting: TableSortingConfig,
    filter: StoreUserOrderProductProductFilter
  ): Observable<LlecoopProduct[]> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        if (!this.firestoreCollection) {
          return of([]);
        }

        const conditions: QueryConstraint[] = [
          ...this.getFilterConditions(filter),
          ...this.getSortingConditions(sorting),
          ...this.getPaginationConditions(pagination, sorting[0]),
          where('isAvailable', '==', true),
        ];

        const q = query(this.firestoreCollection, ...conditions);
        return collectionData(q, { idField: 'id' }).pipe(
          takeUntil(this.destroy$),
          distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
          map(products => products as LlecoopProduct[]),
          catchError(error => this.handlePermissionError(error, []))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  // override getItem(id: EntityId): Observable<LlecoopUserOrder | null> {
  //   return runInInjectionContext(this.injectionContext, () => {
  //     try {
  //       if (!this.firestoreUserOrderProductsCollection) {
  //         return of(null);
  //       }

  //       const q = query(this.firestoreUserOrderProductsCollection, where('userId', '==', userId));

  //       return collectionData(q, { idField: 'id' }).pipe(
  //         takeUntil(this.destroy$),
  //         map(orders => (orders.find(order => order.id === id) as LlecoopUserOrder) || null),
  //         catchError(error => this.handlePermissionError(error, null))
  //       );
  //     } catch (error) {
  //       return throwError(() => error);
  //     }
  //   });
  // }

  override getCount(filter: StoreUserOrderProductProductFilter): Observable<number> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const conditions = [...this.getFilterConditions(filter), where('isAvailable', '==', true)];

        if (!this.firestoreCollection) {
          return of(0);
        }

        const q = query(this.firestoreCollection, ...conditions);
        return collectionData(q, { idField: 'id' }).pipe(
          takeUntil(this.destroy$),
          distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
          map(products => products.length),
          catchError(error => this.handlePermissionError(error, 0))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  override getFilterConditions(filter: StoreUserOrderProductProductFilter): QueryConstraint[] {
    const conditions: QueryConstraint[] = [];
    if (Object.entries(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        if (key === 'text' && value) {
          const normalizedText = latinize(value as string).toLowerCase();
          conditions.push(
            where('normalizedName', '>=', normalizedText),
            where('normalizedName', '<=', normalizedText + '\uf8ff')
          );
        } else if (key === 'category' && value) {
          const normalizedText = latinize(value as string).toLowerCase();
          conditions.push(
            where('category', '>=', normalizedText),
            where('category', '<=', normalizedText + '\uf8ff')
          );
        } else if (value) {
          conditions.push(where(key, '==', value));
        }
      });
    }

    return conditions;
  }

  protected override firebaseAssignTypes() {
    return {
      ...super.firebaseAssignTypes(),
      toFirestore: (doc: LlecoopProduct): DocumentData => ({
        ...doc,
        normalizedName: latinize(doc.name).toLowerCase(),
        createdAt: doc.createdAt ?? Timestamp.now(),
        updatedAt: Timestamp.now(),
      }),
    };
  }
}
