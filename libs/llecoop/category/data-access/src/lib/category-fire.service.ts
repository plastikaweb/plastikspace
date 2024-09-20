import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopCategoryFireService {
  private readonly firestore = inject(Firestore);
  private readonly categoryCollection = collection(this.firestore, 'category');

  getAll(): Observable<LlecoopProductCategory[]> {
    return collectionData(this.categoryCollection, { idField: 'id' }) as Observable<
      LlecoopProductCategory[]
    >;
  }

  create(item: Partial<LlecoopProductCategory>) {
    return of(addDoc(this.categoryCollection, item));
  }

  update(item: Partial<LlecoopProductCategory>) {
    const document = doc(this.firestore, `category/${item.id}`);
    return of(updateDoc(document, item));
  }
}
