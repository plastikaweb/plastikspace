import { distinctUntilChanged, map, Observable, of } from 'rxjs';

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
  readonly #ordersGroupCollection = collectionGroup(this.firestore, this.path);

  override getAll(
    pagination: StoreFirebaseCrudPagination<LlecoopUserOrder>,
    sorting: TableSortingConfig,
    filter: StoreUserOrderFilter
  ): Observable<LlecoopUserOrder[]> {
    const userId = this.#authService.currentUser()?.uid;
    if (!userId) {
      return of([]);
    }

    const conditions: QueryConstraint[] = [
      ...this.getFilterConditions(filter),
      ...this.getSortingConditions(sorting),
      ...this.getPaginationConditions(pagination, sorting[0]),
    ];

    const q = query(this.#ordersGroupCollection, ...conditions, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }).pipe(
      distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
      map(orders => orders as LlecoopUserOrder[])
    );
  }

  override getItem(id: EntityId): Observable<LlecoopUserOrder | null> {
    const userId = this.#authService.currentUser()?.uid;
    if (!userId) {
      return of(null);
    }

    const q = query(this.#ordersGroupCollection, where('userId', '==', userId));

    return collectionData(q, { idField: 'id' }).pipe(
      map(orders => (orders.find(order => order.id === id) as LlecoopUserOrder) || null)
    );
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

  override getCount(filter: StoreUserOrderFilter): Observable<number> {
    const userId = this.#authService.currentUser()?.uid;
    if (!userId) {
      return of(0);
    }
    const conditions = [...this.getFilterConditions(filter), where('userId', '==', userId)];

    const q = query(this.#ordersGroupCollection, ...conditions);
    return collectionData(q).pipe(
      distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
      map(orders => orders.length)
    );
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

  getCurrentUserOrder(orderListId: EntityId): Observable<LlecoopUserOrder | null> {
    const userId = this.#authService.currentUser()?.uid;
    if (!userId) {
      return of(null);
    }
    const q = query(
      this.#ordersGroupCollection,
      where('userId', '==', userId),
      where('orderListId', '==', orderListId)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(orders => orders[0] || null)
    ) as Observable<LlecoopUserOrder | null>;
  }

  private setCollection(item: LlecoopUserOrder): void {
    this.collection = collection(
      this.firestore,
      `order-list/${item.orderListId}/orders`
    ).withConverter(this.firebaseAssignTypes());
  }
}
