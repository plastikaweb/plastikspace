import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { go, selectRouteQueryParams } from '@plastik/core/router-state';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';
import { PageEventConfig } from '@plastik/shared/table/entities';
import { take } from 'rxjs';

import * as NasaImagesSelectors from './nasa-images.selectors';

@Injectable()
export class NasaImagesFacade {
  private readonly store = inject(Store);

  images$ = this.store.pipe(select(NasaImagesSelectors.selectAllNasaImages));
  count$ = this.store.pipe(select(NasaImagesSelectors.selectNasaImagesCount));

  search(params: NasaImagesSearchApiParams): void {
    this.store.dispatch(
      go({
        path: [],
        extras: {
          queryParams: { ...params, page: '1' },
          queryParamsHandling: 'merge',
        },
      }),
    );
  }

  changePagination({ pageIndex }: PageEventConfig) {
    this.store
      .select(selectRouteQueryParams)
      .pipe(take(1))
      .subscribe(queryParams => {
        this.store.dispatch(go({ path: [], extras: { queryParams: { ...queryParams, page: ++pageIndex }, queryParamsHandling: 'merge' } }));
      });
  }
}
