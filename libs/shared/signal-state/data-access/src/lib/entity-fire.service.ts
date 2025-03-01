import { distinctUntilChanged, from, map, Observable } from 'rxjs';

import { inject } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  updateDoc,
  WithFieldValue,
} from '@angular/fire/firestore';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity } from '@plastik/core/entities';
import { latinize } from '@plastik/shared/latinize';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { FirebaseServiceType } from './firebase-service.type';
import { StoreFirebaseCrudFilter, StoreFirebaseCrudPagination } from './store-firebase-crud';

export abstract class EntityFireService<T extends BaseEntity> extends FirebaseServiceType<T> {
  protected abstract path: string;
  protected readonly firestore = inject(Firestore);
  protected collection: ReturnType<typeof collection> | null = null;

  protected get firestoreCollection() {
    if (!this.collection) {
      this.collection = collection(this.firestore, this.path).withConverter(
        this.firebaseAssignTypes()
      );
    }
    return this.collection;
  }

  protected abstract override getFilterConditions(
    filter: StoreFirebaseCrudFilter
  ): QueryConstraint[];

  getAll(
    pagination: StoreFirebaseCrudPagination<T>,
    sorting: TableSortingConfig,
    filter: StoreFirebaseCrudFilter
  ): Observable<T[]> {
    const conditions: QueryConstraint[] = [
      ...this.getFilterConditions(filter),
      ...this.getSortingConditions(sorting),
      ...this.getPaginationConditions(pagination, sorting[0]),
    ];

    const postCollection = query(this.firestoreCollection, ...conditions);
    return collectionData(postCollection, { idField: 'id' }).pipe(
      distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
      map(items => items as T[])
    );
  }

  getItem(id: EntityId): Observable<T | null> {
    if (!id) {
      throw new Error('ID is required for get operation');
    }
    const document = doc(this.firestoreCollection, id as string);
    return docData(document, { idField: 'id' }) as Observable<T | null>;
  }

  create(item: Partial<T>): Observable<DocumentReference<T>> {
    return from(addDoc(this.firestoreCollection, item as WithFieldValue<T>)) as Observable<
      DocumentReference<T>
    >;
  }

  update(item: Partial<T>): Observable<void> {
    if (!item.id) {
      throw new Error('ID is required for update operation');
    }
    const document = doc(this.firestoreCollection, item.id as string);
    const updateData = this.firebaseAssignTypes().toFirestore(item as T);
    return from(updateDoc(document, updateData));
  }

  delete(item: T): Observable<void> {
    if (!item.id) {
      throw new Error('ID is required for delete operation');
    }
    const document = doc(this.firestoreCollection, item.id as string);
    return from(deleteDoc(document));
  }

  getCount(filter: StoreFirebaseCrudFilter): Observable<number> {
    const conditions = this.getFilterConditions(filter);
    const postCollection = query(this.firestoreCollection, ...conditions);
    return collectionData(postCollection).pipe(
      distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
      map(items => items.length)
    );
  }

  protected getPaginationConditions(
    pagination: StoreFirebaseCrudPagination<T>,
    activeField: string
  ): QueryConstraint[] {
    const { pageSize, pageIndex, pageLastElements } = pagination;
    const conditions: QueryConstraint[] = [];

    conditions.push(limit(pageSize));

    if (pageIndex > 0 && pageLastElements?.has(pageIndex - 1)) {
      const lastDoc = pageLastElements.get(pageIndex - 1);
      conditions.push(startAfter(lastDoc?.[activeField]));
    }

    return conditions;
  }

  protected getSortingConditions(sorting: TableSortingConfig): QueryConstraint[] {
    const [active, direction] = sorting;
    const conditions: QueryConstraint[] = [];
    conditions.push(orderBy(active, direction || 'asc'));
    return conditions;
  }

  protected firebaseAssignTypes() {
    return {
      toFirestore(doc: T): DocumentData {
        return {
          ...doc,
          normalizedName: latinize(doc.name).toLowerCase(),
          createdAt: doc.createdAt ?? serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): T {
        const data = snapshot.data() as T;
        return data;
      },
    };
  }
}
