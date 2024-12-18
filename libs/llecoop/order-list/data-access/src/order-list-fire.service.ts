import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  collectionGroup,
  deleteDoc,
  doc,
  Firestore,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { LlecoopOrder, LlecoopUserOrder } from '@plastik/llecoop/entities';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListFireService {
  readonly #firestore = inject(Firestore);
  readonly #orderListCollection = collection(this.#firestore, 'order-list');
  readonly #orderListOrdersGroup = collectionGroup(this.#firestore, 'orders');

  getAll(): Observable<LlecoopOrder[]> {
    return collectionData(this.#orderListCollection, { idField: 'id' }) as Observable<
      LlecoopOrder[]
    >;
  }

  create(item: Partial<LlecoopOrder>) {
    return from(
      addDoc(this.#orderListCollection, {
        ...item,
        createdAt: Timestamp.now(),
      })
    );
  }

  update(item: Partial<LlecoopOrder>) {
    const document = doc(this.#firestore, `order-list/${item.id}`);
    return from(updateDoc(document, { ...item, updatedAt: serverTimestamp() }));
  }

  delete(item: LlecoopOrder) {
    const document = doc(this.#firestore, `order-list/${item.id}`);
    return from(deleteDoc(document));
  }

  getAllByOrderListId(orderListId: LlecoopOrder['id']) {
    const q = query(this.#orderListOrdersGroup, where(`orderListId`, '==', orderListId));
    return collectionData(q, { idField: 'id' }) as Observable<LlecoopUserOrder[]>;
  }
}
