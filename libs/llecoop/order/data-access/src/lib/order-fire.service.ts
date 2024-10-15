import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  setDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { LlecoopOrder, LlecoopUser, LlecoopUserOrder } from '@plastik/llecoop/entities';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopOrderFireService {
  private readonly firestore = inject(Firestore);
  private readonly orderCollection = collection(this.firestore, 'order');

  getAll(): Observable<LlecoopUserOrder[]> {
    return collectionData(this.orderCollection, { idField: 'id' }) as Observable<
      LlecoopUserOrder[]
    >;
  }

  create(
    item: Partial<LlecoopUserOrder>,
    currentOrderId: LlecoopOrder['id'],
    currentUserId: LlecoopUser['id']
  ) {
    const document = doc(this.firestore, `order/${currentOrderId}/user/${currentUserId}`);
    return from(
      setDoc(document, {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    );
  }
}
