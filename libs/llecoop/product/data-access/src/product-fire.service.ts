import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { Observable } from 'rxjs';

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
}
