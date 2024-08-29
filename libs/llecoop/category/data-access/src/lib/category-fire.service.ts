import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, orderBy } from '@angular/fire/firestore';
import { ProductCategory } from '@plastik/llecoop/entities';
import { TableSorting } from '@plastik/shared/table/entities';
import { query } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryFireService {
  private readonly firestore = inject(Firestore);
  private readonly categoryCollection = collection(this.firestore, 'category');

  getAll({ active, direction }: TableSorting): Observable<ProductCategory[]> {
    const q = query(this.categoryCollection, orderBy(active, direction || 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<ProductCategory[]>;
  }
}
