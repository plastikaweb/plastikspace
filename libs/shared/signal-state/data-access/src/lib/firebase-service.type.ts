import { Observable } from 'rxjs';

import {
  DocumentData,
  DocumentReference,
  QueryConstraint,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity } from '@plastik/core/entities';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { StoreFirebaseCrudPagination } from './store-firebase-crud';

export abstract class FirebaseServiceType<T extends BaseEntity> {
  abstract getAll(
    pagination: StoreFirebaseCrudPagination<T>,
    sorting: TableSortingConfig,
    filter: Record<string, string | null | boolean>
  ): Observable<T[]>;
  abstract getItem(id: EntityId): Observable<T | null>;
  abstract getCount(filter: Record<string, string | null | boolean>): Observable<number>;
  abstract create(item: Partial<T>): Observable<DocumentReference<T, DocumentData>>;
  abstract update(item: Partial<T>): Observable<void>;
  abstract delete(item: T): Observable<void>;

  protected abstract getPaginationConditions(
    pagination: StoreFirebaseCrudPagination<T>,
    activeField: string
  ): QueryConstraint[];
  protected abstract getSortingConditions(sorting: TableSortingConfig): QueryConstraint[];
  protected abstract getFilterConditions(
    filter: Record<string, string | null | boolean>
  ): QueryConstraint[];

  protected abstract firebaseAssignTypes(): {
    toFirestore: (doc: T) => DocumentData;
    fromFirestore: (snapshot: QueryDocumentSnapshot) => T;
  };
}
