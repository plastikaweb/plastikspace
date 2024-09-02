import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { ProductCategory } from '@plastik/llecoop/entities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryFireService {
  private readonly firestore = inject(Firestore);
  private readonly categoryCollection = collection(this.firestore, 'category');

  getAll(): Observable<ProductCategory[]> {
    return collectionData(this.categoryCollection, { idField: 'id' }) as Observable<
      ProductCategory[]
    >;
  }
}
