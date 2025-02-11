import { from, map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
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
  where,
  WithFieldValue,
} from '@angular/fire/firestore';
import { LlecoopFeatureStorePagination } from '@plastik/llecoop/data-access';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { latinize } from '@plastik/shared/latinize';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { ProductStoreFilter } from './product-store';

/**
 * @description Assign types to Firestore product documents.
 * @template T
 * **T** refers to the main feature model item used inside applications.
 * @returns {object} An object with methods to convert between Firestore documents and types:
 * - `toFirestore`: Converts a typed document to Firestore DocumentData
 * - `fromFirestore`: Converts a Firestore snapshot to typed document
 */
function firebaseAssignTypes<T extends LlecoopProduct>() {
  return {
    toFirestore(doc: T): DocumentData {
      return {
        ...doc,
        normalizedName: latinize(doc.name).toLowerCase(),
        isAvailable: doc.isAvailable ?? false,
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
export class LlecoopProductFireService {
  readonly #path = 'product';
  readonly #firestore = inject(Firestore);
  readonly #collection = collection(this.#firestore, this.#path).withConverter(
    firebaseAssignTypes<LlecoopProduct>()
  );

  #getFilterConditions(filter: ProductStoreFilter): QueryConstraint[] {
    const conditions: QueryConstraint[] = [];

    if (Object.entries(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        if (key === 'text' && value) {
          const normalizedText = latinize(value as string).toLowerCase();
          conditions.push(
            where('normalizedName', '>=', normalizedText),
            where('normalizedName', '<=', normalizedText + '\uf8ff')
          );
        } else if (key === 'category' && value !== 'all') {
          conditions.push(where('categoryRef', '==', value));
        } else if (key === 'inStock' && value !== 'all') {
          conditions.push(where('isAvailable', '==', value));
        }
      });
    }

    return conditions;
  }

  #getPaginationConditions(
    pagination: LlecoopFeatureStorePagination<LlecoopProduct>,
    sorting: TableSortingConfig
  ): QueryConstraint[] {
    const { pageSize, pageIndex, pageLastElements } = pagination;
    const [active, direction] = sorting;
    const conditions: QueryConstraint[] = [];

    // Add ordering
    conditions.push(orderBy(active, direction || 'asc'));

    if (active !== 'normalizedName') {
      conditions.push(orderBy('normalizedName', direction || 'asc'));
    }

    // Add pagination
    conditions.push(limit(pageSize));

    if (pageIndex > 0 && pageLastElements?.has(pageIndex - 1)) {
      const lastDoc = pageLastElements.get(pageIndex - 1);
      if (active !== 'normalizedName') {
        conditions.push(startAfter(lastDoc?.[active], lastDoc?.normalizedName));
      } else {
        conditions.push(startAfter(lastDoc?.[active]));
      }
    }

    return conditions;
  }

  getAll(
    pagination: LlecoopFeatureStorePagination<LlecoopProduct>,
    sorting: TableSortingConfig,
    filter: ProductStoreFilter
  ): Observable<LlecoopProduct[]> {
    const conditions: QueryConstraint[] = [
      ...this.#getFilterConditions(filter),
      ...this.#getPaginationConditions(pagination, sorting),
    ];

    const postCollection = query(this.#collection, ...conditions);
    return collectionData(postCollection, { idField: 'id' });
  }

  create(item: LlecoopProduct) {
    return from(addDoc(this.#collection, item as WithFieldValue<LlecoopProduct>));
  }

  update(item: Partial<LlecoopProduct>) {
    if (!item.id) {
      throw new Error('ID is required for update operation');
    }
    const document = doc(this.#firestore, this.#path, item.id as string);
    const updateData = firebaseAssignTypes<LlecoopProduct>().toFirestore(item as LlecoopProduct);
    return from(updateDoc(document, updateData));
  }

  delete(item: LlecoopProduct) {
    if (!item.id) {
      throw new Error('ID is required for delete operation');
    }
    const document = doc(this.#firestore, this.#path, item.id as string);
    return from(deleteDoc(document));
  }

  getCount(filter: ProductStoreFilter) {
    const conditions = this.#getFilterConditions(filter);
    const postCollection = query(this.#collection, ...conditions);
    return collectionData(postCollection).pipe(map(products => products.length));
  }
}
