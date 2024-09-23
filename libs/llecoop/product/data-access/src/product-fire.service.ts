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
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductFireService {
  private readonly firestore = inject(Firestore);
  private readonly productCollection = collection(this.firestore, 'product');

  getAll(): Observable<LlecoopProduct[]> {
    return collectionData(this.productCollection, { idField: 'id' }) as Observable<
      LlecoopProduct[]
    >;
  }

  create(item: Partial<LlecoopProduct>) {
    return from(
      addDoc(this.productCollection, {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    );
  }

  update(item: Partial<LlecoopProduct>) {
    const document = doc(this.firestore, `product/${item.id}`);
    return from(
      updateDoc(document, {
        ...item,
        updatedAt: Timestamp.now(),
      })
    );
  }

  delete(item: LlecoopProduct) {
    const document = doc(this.firestore, `product/${item.id}`);
    return from(deleteDoc(document));
  }
}
