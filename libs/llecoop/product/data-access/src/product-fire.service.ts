import { from, map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  startAfter,
  updateDoc,
  WithFieldValue,
} from '@angular/fire/firestore';
import { firebaseAssignTypes } from '@plastik/core/entities';
import { LlecoopFeatureStorePagination } from '@plastik/llecoop/data-access';
import { LlecoopProduct } from '@plastik/llecoop/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductFireService {
  readonly #path = 'product';
  readonly #firestore = inject(Firestore);
  readonly #collection = collection(this.#firestore, this.#path).withConverter(
    firebaseAssignTypes<LlecoopProduct>()
  );

  getAll(config: LlecoopFeatureStorePagination<LlecoopProduct>): Observable<LlecoopProduct[]> {
    const { pageSize, pageIndex, pageLastElements } = config;
    const conditions: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(pageSize)];
    if (pageIndex > 0 && pageLastElements?.has(pageIndex - 1)) {
      conditions.push(startAfter(pageLastElements.get(pageIndex - 1)?.createdAt));
    }
    const postCollection = query(this.#collection, ...conditions);
    return collectionData(postCollection, { idField: 'id' });
  }

  create(item: Partial<LlecoopProduct>) {
    return from(
      addDoc(this.#collection, {
        ...item,
        isAvailable: item.isAvailable ?? false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as WithFieldValue<LlecoopProduct>)
    );
  }

  update(item: Partial<LlecoopProduct>) {
    const document = doc(this.#firestore, `product/${item.id}`);
    return from(
      updateDoc(document, {
        ...item,
        updatedAt: serverTimestamp(),
      } as WithFieldValue<LlecoopProduct>)
    );
  }

  delete(item: LlecoopProduct) {
    const document = doc(this.#firestore, `product/${item.id}`);
    return from(deleteDoc(document));
  }

  getCount(): Observable<number> {
    return collectionData(query(this.#collection)).pipe(map(products => products.length));
  }
}
