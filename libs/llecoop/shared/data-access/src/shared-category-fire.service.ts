import { catchError, distinctUntilChanged, map, Observable, throwError } from 'rxjs';

import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { collection, collectionData, Firestore, query } from '@angular/fire/firestore';
import { FormSelectOption } from '@plastik/core/entities';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopSharedCategoryFireService {
  readonly #firestore = inject(Firestore);
  readonly #injectionContext = inject(EnvironmentInjector);
  #collection: ReturnType<typeof collection> | null = null;

  private getAllCategories(): Observable<LlecoopProductCategory[]> {
    return runInInjectionContext(this.#injectionContext, () => {
      try {
        this.#collection ??= collection(this.#firestore, 'category');
        if (!this.#collection) {
          return throwError(() => new Error('No collection available'));
        }

        const postCollection = query(this.#collection);

        return collectionData(postCollection, { idField: 'id' }).pipe(
          distinctUntilChanged((prev, next) => JSON.stringify(prev) === JSON.stringify(next)),
          map(items => items as LlecoopProductCategory[]),
          catchError(error => throwError(() => error))
        );
      } catch (error) {
        return throwError(() => error);
      }
    });
  }

  getCategoriesSelectData(allOption = true): Observable<FormSelectOption[]> {
    return this.getAllCategories().pipe(
      map(categories =>
        categories.map(category => ({ label: category.name, value: `category/${category.id}` }))
      ),
      map(categories => categories.sort((a, b) => a.label.localeCompare(b.label))),
      map(categories => (allOption ? [{ label: 'Totes', value: '' }, ...categories] : categories))
    );
  }
}
