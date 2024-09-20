import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { Observable, of } from 'rxjs';

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
    return of(addDoc(this.productCollection, item));
  }

  update(item: Partial<LlecoopProduct>) {
    const document = doc(this.firestore, `product/${item.id}`);
    return of(updateDoc(document, item));
  }
}
