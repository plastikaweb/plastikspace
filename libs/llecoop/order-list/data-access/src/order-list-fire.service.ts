import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  Timestamp,
} from '@angular/fire/firestore';
import { LlecoopOrder } from '@plastik/llecoop/entities';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderListFireService {
  private readonly firestore = inject(Firestore);
  private readonly orderListCollection = collection(this.firestore, 'order-list');

  getAll(): Observable<LlecoopOrder[]> {
    return collectionData(this.orderListCollection, { idField: 'id' }) as Observable<
      LlecoopOrder[]
    >;
  }

  create(item: Partial<LlecoopOrder>) {
    return from(
      addDoc(this.orderListCollection, {
        ...item,
        createdAt: Timestamp.now(),
      })
    );
  }

  delete(item: LlecoopOrder) {
    const document = doc(this.firestore, `order-list/${item.id}`);
    return from(deleteDoc(document));
  }
}
