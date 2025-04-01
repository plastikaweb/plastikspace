import { catchError, map, takeUntil } from 'rxjs';

import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  collectionGroup,
  DocumentData,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { LlecoopOrder, LlecoopProduct, LlecoopUserOrder } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import {
  EntityFireService,
  StoreFirebaseCrudPagination,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { OrderListStoreFirebaseCrudState, StoreOrderListFilter } from './order-list-store';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListFireService extends EntityFireService<LlecoopOrder> {
  protected readonly path = 'order-list';

  readonly #ordersGroup = collectionGroup(this.firestore, 'orders');
  readonly #productCollection = collection(this.firestore, 'product');

  override getFilterConditions(filter: StoreOrderListFilter): QueryConstraint[] {
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

  protected override getSortingConditions(sorting: TableSortingConfig): QueryConstraint[] {
    const [active, direction] = sorting;
    const conditions: QueryConstraint[] = [];
    conditions.push(orderBy(active, direction || 'asc'));

    if (active === 'orderCount' || active === 'status') {
      conditions.push(orderBy('normalizedName', direction || 'asc'));
    }

    return conditions;
  }

  protected override getPaginationConditions(
    pagination: StoreFirebaseCrudPagination<LlecoopOrder>,
    activeField: string
  ): QueryConstraint[] {
    const { pageSize, pageIndex, pageLastElements } = pagination;
    const conditions: QueryConstraint[] = [];

    conditions.push(limit(pageSize));

    if (pageIndex > 0 && pageLastElements?.has(pageIndex - 1)) {
      const lastDoc = pageLastElements.get(pageIndex - 1);
      if (activeField === 'orderCount' || activeField === 'status') {
        conditions.push(startAfter(lastDoc?.[activeField], lastDoc?.normalizedName));
      } else {
        conditions.push(startAfter(lastDoc?.[activeField]));
      }
    }

    return conditions;
  }

  protected override firebaseAssignTypes() {
    return {
      ...super.firebaseAssignTypes(),
      toFirestore: (doc: LlecoopOrder): DocumentData => {
        return {
          ...doc,
          normalizedName: latinize(doc.name).toLowerCase(),
          createdAt: doc.createdAt ?? Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
      },
    };
  }

  getCurrentOrderList() {
    if (!this.firestoreCollection) {
      throw new Error('Firestore collection not initialized');
    }
    const document = query(this.firestoreCollection, where('status', '==', 'progress'));

    return collectionData(document, { idField: 'id' }).pipe(
      takeUntil(this.destroy$),
      map(orders => orders[0] as LlecoopOrder),
      catchError(error => this.handlePermissionError(error, null))
    );
  }

  getAllByOrderListId(
    orderListId: LlecoopOrder['id'],
    pagination: OrderListStoreFirebaseCrudState['selectedItemUserPagination'],
    sorting: OrderListStoreFirebaseCrudState['selectedItemUserSorting'],
    filter: OrderListStoreFirebaseCrudState['selectedItemUserFilter']
  ) {
    const conditions: QueryConstraint[] = [];

    if (pagination.pageIndex > 0 && pagination.pageLastElements?.has(pagination.pageIndex - 1)) {
      const lastDoc = pagination.pageLastElements.get(pagination.pageIndex - 1);
      conditions.push(startAfter(lastDoc?.[sorting[0]]));
    }
    const q = query(
      this.#ordersGroup,
      where(`orderListId`, '==', orderListId),
      orderBy(sorting[0], sorting[1] === 'asc' ? 'asc' : 'desc'),
      limit(pagination.pageSize),
      ...conditions,
      where('userName', '>=', filter.text),
      where('userName', '<=', filter.text + '\uf8ff')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      takeUntil(this.destroy$),
      map(orders => orders as LlecoopUserOrder[]),
      catchError(error => this.handlePermissionError(error, []))
    );
  }

  getAvailableProducts() {
    const q = query(this.#productCollection, where('isAvailable', '==', true));

    return collectionData(q, { idField: 'id' }).pipe(
      takeUntil(this.destroy$),
      map(products => products as LlecoopProduct[]),
      catchError(error => this.handlePermissionError(error, []))
    );
  }
}
