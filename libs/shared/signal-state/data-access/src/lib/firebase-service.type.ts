import { Observable } from 'rxjs';

import { Signal } from '@angular/core';
import {
    DocumentData, DocumentReference, QueryConstraint, QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { EntityId } from '@ngrx/signals/entities';
import { BaseEntity } from '@plastik/core/entities';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { StoreFirebaseCrudPagination } from './store-firebase-crud';

/**
 * Abstract base class for Firebase services that handle CRUD operations.
 * Provides a common interface for interacting with Firestore collections.
 * All operations are controlled by the activeConnection signal.
 * @template T - Type of the entity, must extend BaseEntity.
 */
export abstract class FirebaseServiceType<T extends BaseEntity> {
  /**
   * Signal that indicates if the connection to Firestore is active.
   * When false, all operations will return empty results and the collection reference will be cleared.
   */
  abstract activeConnection: Signal<boolean>;

  /**
   * Retrieves a paginated, sorted, and filtered list of entities from Firestore.
   * @param pagination - Pagination configuration including page size and last elements.
   * @param sorting - Sorting configuration specifying field and direction.
   * @param filter - Filter criteria to apply to the query.
   * @returns Observable of an array of entities.
   */
  abstract getAll(
    pagination: StoreFirebaseCrudPagination<T>,
    sorting: TableSortingConfig,
    filter: Record<string, string | null | boolean>
  ): Observable<T[]>;

  /**
   * Retrieves a single entity by its ID.
   * @param id - The unique identifier of the entity.
   * @returns Observable of the entity or null if not found.
   */
  abstract getItem(id: EntityId): Observable<T | null>;

  /**
   * Retrieves the count of entities that match the given filter.
   * @param filter - The filter to apply to the query.
   * @returns Observable of the count of entities that match the filter.
   */
  abstract getCount(filter: Record<string, string | null | boolean>): Observable<number>;

  /**
   * Creates a new entity in Firestore.
   * @param item - Partial entity data to create.
   * @returns Observable of the DocumentReference for the created entity or null if connection is inactive.
   */
  abstract create(item: Partial<T>): Observable<DocumentReference<T, DocumentData> | null>;

  /**
   * Updates an existing entity in Firestore.
   * @param item - Partial entity data to update, must include id.
   * @returns Observable that completes when the update is successful or null if connection is inactive.
   */
  abstract update(item: Partial<T>): Observable<void | null>;

  /**
   * Deletes an entity from Firestore.
   * @param item - The entity to delete.
   * @returns Observable that completes when the deletion is successful or null if connection is inactive.
   */
  abstract delete(item: T): Observable<void | null>;

  /**
   * Sets the active connection state for Firestore operations.
   * When set to false, all operations will return empty results or null.
   * @param active - Boolean indicating whether to enable Firestore operations.
   */
  abstract setActiveConnection(active: boolean): void;

  /**
   * Creates pagination query constraints for Firestore.
   * @param pagination - Pagination configuration to apply.
   * @param activeField - Field to use for pagination cursors.
   * @returns Array of Firestore query constraints for pagination.
   */
  protected abstract getPaginationConditions(
    pagination: StoreFirebaseCrudPagination<T>,
    activeField: string
  ): QueryConstraint[];

  /**
   * Creates sorting query constraints for Firestore.
   * @param sorting - Sorting configuration to apply.
   * @returns Array of Firestore query constraints for sorting.
   */
  protected abstract getSortingConditions(sorting: TableSortingConfig): QueryConstraint[];

  /**
   * Creates filtering query constraints for Firestore.
   * Must be implemented by derived classes to define specific filtering logic.
   * @param filter - Filter criteria to convert into Firestore query constraints.
   * @returns Array of Firestore query constraints for filtering.
   */
  protected abstract getFilterConditions(
    filter: Record<string, string | null | boolean>
  ): QueryConstraint[];

  /**
   * Provides type conversion methods for Firestore data.
   * Must be implemented by derived classes to define how to convert between
   * Firestore DocumentData and the entity type.
   * @returns Object with toFirestore and fromFirestore conversion methods.
   */
  protected abstract firebaseAssignTypes(): {
    toFirestore: (doc: T) => DocumentData;
    fromFirestore: (snapshot: QueryDocumentSnapshot) => T;
  };
}
