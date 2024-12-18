import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryFireService {
  readonly #firestore = inject(Firestore);
  readonly #categoryCollection = collection(this.#firestore, 'category');

  getAll(): Observable<LlecoopProductCategory[]> {
    return collectionData(this.#categoryCollection, { idField: 'id' }) as Observable<
      LlecoopProductCategory[]
    >;
  }

  create(item: Partial<LlecoopProductCategory>) {
    return from(
      addDoc(this.#categoryCollection, {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    );
  }

  update(item: Partial<LlecoopProductCategory>) {
    const document = doc(this.#firestore, `category/${item.id}`);
    return from(
      updateDoc(document, {
        ...item,
        updatedAt: Timestamp.now(),
      })
    );
  }

  delete(item: LlecoopProductCategory) {
    const document = doc(this.#firestore, `category/${item.id}`);
    return from(deleteDoc(document));
  }
}
