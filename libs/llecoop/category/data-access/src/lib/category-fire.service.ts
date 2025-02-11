import { from, map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import {
    addDoc, collection, collectionData, deleteDoc, doc, DocumentData, Firestore, limit, orderBy,
    query, QueryConstraint, QueryDocumentSnapshot, serverTimestamp, startAfter, updateDoc, where,
    WithFieldValue
} from '@angular/fire/firestore';
import { LlecoopFeatureStorePagination } from '@plastik/llecoop/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { CategoryStoreFilter } from './category-store';

/**
 * @description Assign types to Firestore categories documents.
 * @template T
 * **T** refers to the main feature model item used inside applications.
 * @returns {object} An object with methods to convert between Firestore documents and types:
 * - `toFirestore`: Converts a typed document to Firestore DocumentData
 * - `fromFirestore`: Converts a Firestore snapshot to typed document
 */
function firebaseAssignTypes<T extends LlecoopProductCategory>() {
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

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryFireService {
  readonly #path = 'category';
  readonly #firestore = inject(Firestore);
  readonly #collection = collection(this.#firestore, this.#path).withConverter(
    firebaseAssignTypes<LlecoopProductCategory>()
  );

  #getFilterConditions(filter: CategoryStoreFilter): QueryConstraint[] {
    const conditions: QueryConstraint[] = [];

    if (Object.entries(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        if (key === 'text' && value) {
          const normalizedText = latinize(value as string).toLowerCase();
          conditions.push(
            where('normalizedName', '>=', normalizedText),
            where('normalizedName', '<=', normalizedText + '\uf8ff')
          );
        }
      });
    }

    return conditions;
  }

  #getPaginationConditions(
    pagination: LlecoopFeatureStorePagination<LlecoopProductCategory>,
    sorting: TableSortingConfig
  ): QueryConstraint[] {
    const { pageSize, pageIndex, pageLastElements } = pagination;
    const [active, direction] = sorting;
    const conditions: QueryConstraint[] = [];

    // Add ordering
    conditions.push(orderBy(active, direction || 'asc'));

    // Add pagination
    conditions.push(limit(pageSize));

    if (pageIndex > 0 && pageLastElements?.has(pageIndex - 1)) {
      const lastDoc = pageLastElements.get(pageIndex - 1);
      conditions.push(startAfter(lastDoc?.[active]));
    }

    return conditions;
  }

  getAll(
    pagination: LlecoopFeatureStorePagination<LlecoopProductCategory>,
    sorting: TableSortingConfig,
    filter: CategoryStoreFilter
  ): Observable<LlecoopProductCategory[]> {
    const conditions: QueryConstraint[] = [
      ...this.#getFilterConditions(filter),
      ...this.#getPaginationConditions(pagination, sorting),
    ];

    const postCollection = query(this.#collection, ...conditions);
    return collectionData(postCollection, { idField: 'id' });
  }

  create(item: Partial<LlecoopProductCategory>) {
    return from(addDoc(this.#collection, item as WithFieldValue<LlecoopProductCategory>));
  }

  update(item: Partial<LlecoopProductCategory>) {
    if (!item.id) {
      throw new Error('ID is required for update operation');
    }
    const document = doc(this.#firestore, this.#path, item.id as string);
    const updateData = firebaseAssignTypes<LlecoopProductCategory>().toFirestore(
      item as LlecoopProductCategory
    );
    return from(updateDoc(document, updateData));
  }

  delete(item: LlecoopProductCategory) {
    if (!item.id) {
      throw new Error('ID is required for delete operation');
    }
    const document = doc(this.#firestore, this.#path, item.id as string);
    return from(deleteDoc(document));
  }

  getCount(filter: CategoryStoreFilter) {
    const conditions = this.#getFilterConditions(filter);
    const postCollection = query(this.#collection, ...conditions);
    return collectionData(postCollection).pipe(map(products => products.length));
  }
}
