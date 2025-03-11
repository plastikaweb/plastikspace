import { catchError, distinctUntilChanged, map, Observable, of, takeUntil, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  collectionGroup,
  DocumentData,
  query,
  QueryConstraint,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { EntityId } from '@ngrx/signals/entities';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import {
  EntityFireService,
  StoreFirebaseCrudPagination,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { StoreUserOrderFilter } from './user-order-store';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderFireService extends EntityFireService<LlecoopUserOrder> {
  protected readonly path = 'orders';
  readonly #authService = inject(FirebaseAuthService);
  #ordersGroupCollection: ReturnType<typeof collectionGroup> | null = null;

  protected get firestoreOrderGroupCollection() {
    if (!this.#ordersGroupCollection && this.activeConnection()) {
      this.#ordersGroupCollection = collectionGroup(this.firestore, this.path);
    }
    return this.#ordersGroupCollection;
  }

  private setCollection(item: LlecoopUserOrder): void {
    if (!this.collection && this.activeConnection()) {
      this.collection = collection(
        this.firestore,
        `order-list/${item.orderListId}/orders`
      ).withConverter(this.firebaseAssignTypes());
    }
  }

  override getAll(
    pagination: StoreFirebaseCrudPagination<LlecoopUserOrder>,
    sorting: TableSortingConfig,
    filter: StoreUserOrderFilter
  ): Observable<LlecoopUserOrder[]> {
    try {
      const userId = this.#authService.currentUser()?.uid;
      if (!userId) {
        return of([]);
      }

      if (!this.firestoreOrderGroupCollection) {
        return of([]);
      }

      const conditions: QueryConstraint[] = [
        ...this.getFilterConditions(filter),
        ...this.getSortingConditions(sorting),
        ...this.getPaginationConditions(pagination, sorting[0]),
      ];

      const q = query(
        this.firestoreOrderGroupCollection,
        ...conditions,
        where('userId', '==', userId)
      );
      return collectionData(q, { idField: 'id' }).pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
        map(orders => orders as LlecoopUserOrder[]),
        catchError(error => this.handlePermissionError(error, []))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  override getItem(id: EntityId): Observable<LlecoopUserOrder | null> {
    try {
      const userId = this.#authService.currentUser()?.uid;
      if (!userId) {
        return of(null);
      }

      if (!this.firestoreOrderGroupCollection) {
        return of(null);
      }

      const q = query(this.firestoreOrderGroupCollection, where('userId', '==', userId));

      return collectionData(q, { idField: 'id' }).pipe(
        takeUntil(this.destroy$),
        map(orders => (orders.find(order => order.id === id) as LlecoopUserOrder) || null),
        catchError(error => this.handlePermissionError(error, null))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  override create(item: LlecoopUserOrder) {
    this.setCollection(item);
    return super.create(item);
  }

  override update(item: LlecoopUserOrder) {
    this.setCollection(item);
    return super.update(item);
  }

  override delete(item: LlecoopUserOrder) {
    this.setCollection(item);
    return super.delete(item);
  }

  override getCount(filter: StoreUserOrderFilter): Observable<number> {
    try {
      const userId = this.#authService.currentUser()?.uid;
      if (!userId) {
        return of(0);
      }
      const conditions = [...this.getFilterConditions(filter), where('userId', '==', userId)];

      if (!this.firestoreOrderGroupCollection) {
        return of(0);
      }

      const q = query(this.firestoreOrderGroupCollection, ...conditions);
      return collectionData(q, { idField: 'id' }).pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
        map(orders => orders.length),
        catchError(error => this.handlePermissionError(error, 0))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getCurrentUserOrder(orderListId: EntityId): Observable<LlecoopUserOrder | null> {
    try {
      const userId = this.#authService.currentUser()?.uid;
      if (!userId) {
        return of(null);
      }

      if (!this.firestoreOrderGroupCollection) {
        return of(null);
      }

      const q = query(
        this.firestoreOrderGroupCollection,
        where('userId', '==', userId),
        where('orderListId', '==', orderListId)
      );

      return collectionData(q, { idField: 'id' }).pipe(
        takeUntil(this.destroy$),
        map(orders => orders[0] || null),
        catchError(error => this.handlePermissionError(error, null))
      ) as Observable<LlecoopUserOrder | null>;
    } catch (error) {
      return throwError(() => error);
    }
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
        } else if (value) {
          conditions.push(where(key, '==', value));
        }
      });
    }

    return conditions;
  }

  protected override firebaseAssignTypes() {
    const userId = this.#authService.currentUser()?.uid;
    const userEmail = this.#authService.currentUser()?.email;

    return {
      ...super.firebaseAssignTypes(),
      toFirestore: (doc: LlecoopUserOrder): DocumentData => ({
        ...doc,
        status: doc.status ?? 'waiting',
        userId,
        userEmail,
        normalizedName: latinize(doc.name).toLowerCase(),
        createdAt: doc.createdAt ?? Timestamp.now(),
        updatedAt: Timestamp.now(),
      }),
    };
  }
}
