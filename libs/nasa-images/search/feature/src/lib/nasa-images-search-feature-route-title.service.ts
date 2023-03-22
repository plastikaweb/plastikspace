import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NasaImagesSearchSearchRouterTitleService {
  private readonly store = inject(Store);

  /**
   * @description Sets the title for the search nasa images route.
   * @returns { Observable<string> } The string to show in the head title based in the search param (q) and the page number (page).
   */
  resolve(): Observable<string> {
    return this.store.select(selectRouteQueryParams).pipe(
      map(params => {
        const validSearchTitle = `search by "${params?.['q']}" (pag. ${params?.['page']})`;
        return params['q'] ? validSearchTitle : 'search';
      }),
    );
  }
}
