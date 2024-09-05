import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { Observable } from 'rxjs';

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
}
