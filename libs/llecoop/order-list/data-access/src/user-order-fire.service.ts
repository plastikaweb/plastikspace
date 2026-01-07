import { catchError, distinctUntilChanged, map, Observable, of, takeUntil, throwError } from 'rxjs';

import { inject, Injectable, runInInjectionContext } from '@angular/core';
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
import { FirebaseAuthService } from '@plastik/auth/util/util/firebase/data-access';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import { TableSortingConfig } from '@plastik/shared/table/entities';
import { EntityFireService, FirebaseCrudPagination } from '@plastik/signal-state/firebase';

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
    if (this.activeConnection()) {
      this.collection = collection(
        this.firestore,
        `order-list/${item.orderListId}/orders`
      ).withConverter(this.firebaseAssignTypes());
    }
  }

  override getList({
    pagination,
    sorting,
    filter,
  }: {
    pagination: FirebaseCrudPagination<LlecoopUserOrder>;
    sorting: TableSortingConfig;
    filter: StoreUserOrderFilter;
  }): Observable<LlecoopUserOrder[]> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const userId = this.#authService.currentUser()?.uid;
        const isAdmin = this.#authService.isAdmin();

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
          ...(!isAdmin ? [where('userId', '==', userId)] : []),
        ];

        const q = query(this.firestoreOrderGroupCollection, ...conditions);
        return collectionData(q, { idField: 'id' }).pipe(
          takeUntil(this.destroy$),
          distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
          map(orders => orders as LlecoopUserOrder[]),
          catchError(error => this.handlePermissionError(error, []))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  override getOne(id: LlecoopUserOrder['id']): Observable<LlecoopUserOrder> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const userId = this.#authService.currentUser()?.uid;
        if (!userId) {
          return of({} as LlecoopUserOrder);
        }

        if (!this.firestoreOrderGroupCollection) {
          return of({} as LlecoopUserOrder);
        }

        const q = query(this.firestoreOrderGroupCollection, where('userId', '==', userId));

        return collectionData(q, { idField: 'id' }).pipe(
          takeUntil(this.destroy$),
          map(orders => {
            const order = orders.find(o => o.id === id);
            if (!order) throw new Error(`Order ${id} not found`);
            return order as LlecoopUserOrder;
          }),
          catchError(error => this.handlePermissionError(error, {} as LlecoopUserOrder))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  override create(item: Partial<LlecoopUserOrder>) {
    if ((item as LlecoopUserOrder).orderListId) {
      this.setCollection(item as LlecoopUserOrder);
    }
    return super.create(item);
  }

  override update(id: EntityId, item: Partial<LlecoopUserOrder>) {
    if ((item as LlecoopUserOrder).orderListId) {
      this.setCollection(item as LlecoopUserOrder);
    }
    return super.update(id, item);
  }

  override delete(id: EntityId) {
    return super.delete(id);
  }

  override getCount(params: { filter: StoreUserOrderFilter }): Observable<number> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const { filter } = params;
        const userId = this.#authService.currentUser()?.uid;
        const isAdmin = this.#authService.isAdmin();
        if (!userId) {
          return of(0);
        }
        const conditions = [
          ...this.getFilterConditions(filter),
          ...(!isAdmin ? [where('userId', '==', userId)] : []),
        ];

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
    });
  }

  getCurrentUserOrder(orderListId: EntityId): Observable<LlecoopUserOrder | null> {
    return runInInjectionContext(this.injectionContext, () => {
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
        } else if (key === 'userNormalizedName' && value) {
          const normalizedText = latinize(value as string).toLowerCase();
          conditions.push(
            where('userNormalizedName', '>=', normalizedText),
            where('userNormalizedName', '<=', normalizedText + '\uf8ff')
          );
        } else if (key === 'userId' && value) {
          conditions.push(where('userId', '==', value));
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
        status: doc.status ?? 'waitingReview',
        userId,
        userEmail,
        normalizedName: latinize(doc.name as string).toLowerCase(),
        createdAt: doc.createdAt ?? Timestamp.now(),
        updatedAt: Timestamp.now(),
      }),
    };
  }
}
