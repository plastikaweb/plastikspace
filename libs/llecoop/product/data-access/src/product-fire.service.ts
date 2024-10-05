import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopProductFireService {
  private readonly firestore = inject(Firestore);
  private readonly productCollection = collection(this.firestore, 'product');

  getAll(): Observable<LlecoopProduct[]> {
    return collectionData(this.productCollection, { idField: 'id' }).pipe(
      switchMap(products => {
        const productPromises = products.map(async product => {
          let categoryDoc;
          try {
            categoryDoc = await getDoc(doc(this.firestore, product?.['categoryRef']));
          } catch (error) {
            categoryDoc = null;
          }
          return {
            ...product,
            category: categoryDoc?.data() || {},
          } as LlecoopProduct;
        });
        return Promise.all(productPromises);
      })
    );
  }

  create(item: Partial<LlecoopProduct>) {
    return from(
      addDoc(this.productCollection, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  }

  update(item: Partial<LlecoopProduct>) {
    const document = doc(this.firestore, `product/${item.id}`);
    return from(
      updateDoc(document, {
        ...item,
        updatedAt: serverTimestamp(),
      })
    );
  }

  delete(item: LlecoopProduct) {
    const document = doc(this.firestore, `product/${item.id}`);
    return from(deleteDoc(document));
  }
}
