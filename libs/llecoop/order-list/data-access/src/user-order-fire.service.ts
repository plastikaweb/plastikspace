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
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopOrder, LlecoopUserOrder } from '@plastik/llecoop/entities';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserOrderFireService {
  readonly #firestore = inject(Firestore);
  readonly #authService = inject(FirebaseAuthService);
  readonly #ordersGroup = collectionGroup(this.#firestore, 'orders');
  readonly #userId = this.#authService.currentUser()?.uid;

  getAll(): Observable<LlecoopUserOrder[]> {
    if (!this.#userId) {
      return of([]);
    }
    const q = query(this.#ordersGroup, where(`userId`, '==', this.#userId));
    return collectionData(q, { idField: 'id' }) as Observable<LlecoopUserOrder[]>;
  }

  create(item: Partial<LlecoopUserOrder>, currentOrderId: LlecoopOrder['id']) {
    const orderCollection = collection(this.#firestore, `order-list/${currentOrderId}/orders`);

    return from(
      addDoc(orderCollection, {
        ...item,
        status: 'waiting',
        userId: this.#userId,
        userEmail: this.#authService.currentUser()?.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    );
  }

  update(item: Partial<LlecoopUserOrder>) {
    const document = doc(this.#firestore, `order-list/${item.orderListId}/orders/${item.id}`);
    return from(
      updateDoc(document, {
        ...item,
        updatedAt: Timestamp.now(),
      })
    );
  }

  delete(item: LlecoopUserOrder) {
    const document = doc(this.#firestore, `order-list/${item.orderListId}/orders/${item.id}`);
    return from(deleteDoc(document));
  }
}
