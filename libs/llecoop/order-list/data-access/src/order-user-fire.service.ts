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
  where,
} from '@angular/fire/firestore';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopOrder, LlecoopUserOrder } from '@plastik/llecoop/entities';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderUserFireService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(FirebaseAuthService);
  private readonly ordersGroup = collectionGroup(this.firestore, 'orders');

  getAll(): Observable<LlecoopUserOrder[]> {
    const userId = this.authService.currentUser()?.uid;
    if (!userId) {
      return of([]);
    }
    const q = query(this.ordersGroup, where(`userId`, '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<LlecoopUserOrder[]>;
  }

  create(item: Partial<LlecoopUserOrder>, currentOrderId: LlecoopOrder['id']) {
    const orderCollection = collection(this.firestore, `order-list/${currentOrderId}/orders`);
    return from(
      addDoc(orderCollection, {
        ...item,
        status: 'waiting',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    );
  }

  delete(item: LlecoopUserOrder, currentOrderId: LlecoopOrder['id']) {
    const document = doc(this.firestore, `order-list/${currentOrderId}/orders/${item.id}`);
    return from(deleteDoc(document));
  }
}
