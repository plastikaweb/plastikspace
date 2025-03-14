/* eslint-disable no-console */
import {
    catchError, distinctUntilChanged, from, map, Observable, of, Subject, takeUntil, throwError
} from 'rxjs';

import { inject, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
    addDoc, collection, collectionData, deleteDoc, doc, docData, DocumentData, DocumentReference,
    Firestore, limit, orderBy, query, QueryConstraint, QueryDocumentSnapshot, serverTimestamp,
    startAfter, updateDoc, WithFieldValue
} from '@angular/fire/firestore';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity } from '@plastik/core/entities';
import { latinize } from '@plastik/shared/latinize';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { FirebaseServiceType } from './firebase-service.type';
import { StoreFirebaseCrudFilter, StoreFirebaseCrudPagination } from './store-firebase-crud';

export abstract class EntityFireService<T extends BaseEntity> extends FirebaseServiceType<T> {
  protected readonly destroy$ = new Subject<void>();
  protected abstract path: string;
  protected readonly firestore = inject(Firestore);
  protected collection: ReturnType<typeof collection> | null = null;
  readonly activeConnection = signal(true);

  protected get firestoreCollection() {
    if (!this.collection && this.activeConnection()) {
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
    try {
      const firestoreCollection = this.firestoreCollection;
      if (!firestoreCollection) {
        return of([]);
      }

      const conditions: QueryConstraint[] = [
        ...this.getFilterConditions(filter),
        ...this.getSortingConditions(sorting),
        ...this.getPaginationConditions(pagination, sorting[0]),
      ];
      const postCollection = query(firestoreCollection, ...conditions);

      return collectionData(postCollection, { idField: 'id' }).pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
        map(items => items as T[]),
        catchError(error => this.handlePermissionError(error, []))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getItem(id: EntityId): Observable<T | null> {
    try {
      const firestoreCollection = this.firestoreCollection;
      if (!firestoreCollection) {
        return of(null);
      }

      const docRef = doc(firestoreCollection, id.toString());
      return docData(docRef, { idField: 'id' }).pipe(
        takeUntil(this.destroy$),
        map(item => item as T),
        catchError(error => this.handlePermissionError(error, null))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  create(item: Partial<T>): Observable<DocumentReference<T>> {
    try {
      const firestoreCollection = this.firestoreCollection;
      if (!firestoreCollection) {
        return throwError(() => new Error('No collection available'));
      }

      const addDocumentAndConvert = async (): Promise<DocumentReference<T>> => {
        const docRef = await addDoc(firestoreCollection, item as WithFieldValue<T>);
        return docRef as unknown as DocumentReference<T>;
      };

      return from(addDocumentAndConvert()).pipe(
        takeUntil(this.destroy$),
        catchError(error => throwError(() => error))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  update(item: Partial<T>): Observable<void> {
    try {
      const firestoreCollection = this.firestoreCollection;
      if (!firestoreCollection) {
        return throwError(() => new Error('No collection available'));
      }

      const docRef = doc(firestoreCollection, item.id?.toString() ?? '');
      const converter = this.firebaseAssignTypes();
      const convertedData = converter.toFirestore(item as T);

      return from(updateDoc(docRef, convertedData)).pipe(
        takeUntil(this.destroy$),
        catchError(error => throwError(() => error))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  delete(item: T): Observable<void> {
    try {
      const firestoreCollection = this.firestoreCollection;
      if (!firestoreCollection) {
        return throwError(() => new Error('No collection available'));
      }

      const docRef = doc(firestoreCollection, item.id?.toString() ?? '');
      return from(deleteDoc(docRef)).pipe(
        takeUntil(this.destroy$),
        catchError(error => throwError(() => error))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getCount(filter: StoreFirebaseCrudFilter): Observable<number> {
    try {
      const firestoreCollection = this.firestoreCollection;
      if (!firestoreCollection) {
        return of(0);
      }

      const conditions = this.getFilterConditions(filter);
      const postCollection = query(firestoreCollection, ...conditions);

      return collectionData(postCollection).pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
        map(items => items.length),
        catchError(error => this.handlePermissionError(error, 0))
      );
    } catch (error) {
      return throwError(() => error);
    }
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

  setActiveConnection(active: boolean): void {
    this.activeConnection.set(active);
    if (!active) {
      this.destroy$.next();
      this.destroy$.complete();
      this.collection = null;
    }
  }

  protected handlePermissionError<R>(error: FirebaseError, defaultValue: R) {
    if (
      error?.code === 'permission-denied' ||
      (error?.message && error.message.includes('Missing or insufficient permissions'))
    ) {
      return of(defaultValue);
    }
    return throwError(() => error);
  }
}
