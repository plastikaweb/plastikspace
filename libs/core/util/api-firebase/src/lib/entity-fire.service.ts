/* eslint-disable no-console */
import {
  catchError,
  distinctUntilChanged,
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';

import { EnvironmentInjector, inject, runInInjectionContext, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  DocumentData,
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
import { BaseEntity, IdType } from '@plastik/core/entities';
import { latinize } from '@plastik/shared/latinize';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { FirebaseServiceType } from './firebase-service.type';
import { FirebaseCrudFilter, FirebaseCrudPagination } from './firebase.types';

/**
 * Abstract base service for Firebase Firestore CRUD operations.
 * Provides complete implementation of common CRUD operations with pagination, sorting, and filtering.
 * Extend this class and implement the abstract methods to create entity-specific services.
 * @template T - Type of the entity, must extend BaseEntity.
 */
export abstract class EntityFireService<T extends BaseEntity> extends FirebaseServiceType<T> {
  protected abstract path: string;
  protected readonly destroy$ = new Subject<void>();
  protected readonly firestore = inject(Firestore);
  protected readonly injectionContext = inject(EnvironmentInjector);
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

  protected abstract override getFilterConditions(filter: FirebaseCrudFilter): QueryConstraint[];

  getList(params: {
    pagination: FirebaseCrudPagination<T>;
    sorting: TableSortingConfig;
    filter: FirebaseCrudFilter;
  }): Observable<T[]> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const firestoreCollection = this.firestoreCollection;
        if (!firestoreCollection) {
          return of([]);
        }

        const conditions: QueryConstraint[] = [
          ...this.getFilterConditions(params.filter),
          ...this.getSortingConditions(params.sorting),
          ...this.getPaginationConditions(params.pagination, params.sorting[0]),
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
    });
  }

  getOne(id: IdType<T>): Observable<T> {
    try {
      return runInInjectionContext(this.injectionContext, () => {
        const firestoreCollection = this.firestoreCollection;
        if (!firestoreCollection) {
          return throwError(() => new Error('No collection available'));
        }

        const docRef = doc(firestoreCollection, id.toString());
        return docData(docRef, { idField: 'id' }).pipe(
          takeUntil(this.destroy$),
          map(item => {
            if (!item) {
              throw new Error(`Entity with id ${id} not found`);
            }
            return item as T;
          }),
          catchError(error => throwError(() => error))
        );
      });
    } catch (error) {
      return throwError(() => error);
    }
  }

  create(item: Partial<T>): Observable<T> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const firestoreCollection = this.firestoreCollection;
        if (!firestoreCollection) {
          return throwError(() => new Error('No collection available'));
        }

        const addDocument = async (): Promise<T> => {
          const docRef = await addDoc(firestoreCollection, item as WithFieldValue<T>);
          const snapshot = await firstValueFrom(
            docData(docRef, { idField: 'id' }).pipe(map(data => data as T))
          );
          if (!snapshot) {
            throw new Error('Failed to retrieve created document');
          }
          return snapshot;
        };

        return from(addDocument()).pipe(
          takeUntil(this.destroy$),
          catchError(error => throwError(() => error))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  update(id: IdType<T>, item: Partial<T>): Observable<void> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const firestoreCollection = this.firestoreCollection;
        if (!firestoreCollection) {
          return throwError(() => new Error('No collection available'));
        }

        const docRef = doc(firestoreCollection, id.toString());
        const converter = this.firebaseAssignTypes();
        const convertedData = converter.toFirestore({ ...item, id } as T);

        return from(updateDoc(docRef, convertedData)).pipe(
          takeUntil(this.destroy$),
          catchError(error => throwError(() => error))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  delete(id: IdType<T>): Observable<void> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const firestoreCollection = this.firestoreCollection;
        if (!firestoreCollection) {
          return throwError(() => new Error('No collection available'));
        }

        const docRef = doc(firestoreCollection, id.toString());
        return from(deleteDoc(docRef)).pipe(
          takeUntil(this.destroy$),
          catchError(error => throwError(() => error))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  getCount(params: { filter: FirebaseCrudFilter }): Observable<number> {
    return runInInjectionContext(this.injectionContext, () => {
      try {
        const firestoreCollection = this.firestoreCollection;
        if (!firestoreCollection) {
          return of(0);
        }

        const conditions = this.getFilterConditions(params.filter);
        const countQuery = query(firestoreCollection, ...conditions);

        return collectionData(countQuery).pipe(
          takeUntil(this.destroy$),
          distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
          map(items => items.length),
          catchError(error => this.handlePermissionError(error, 0))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  protected getPaginationConditions(
    pagination: FirebaseCrudPagination<T>,
    activeField: string
  ): QueryConstraint[] {
    const { pageSize, pageIndex, pageLastElements } = pagination;
    const conditions: QueryConstraint[] = [];

    conditions.push(limit(pageSize));

    if (pageIndex > 0 && pageLastElements?.has(pageIndex - 1)) {
      const lastDoc = pageLastElements.get(pageIndex - 1);
      conditions.push(startAfter((lastDoc as Record<string, unknown>)?.[activeField]));
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
          normalizedName: latinize(doc.name as string).toLowerCase(),
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
