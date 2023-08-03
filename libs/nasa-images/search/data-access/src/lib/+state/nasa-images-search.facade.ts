import { Injectable } from '@angular/core';
import { select } from '@ngrx/store';
import { routerActions, selectRouteQueryParams } from '@plastik/core/router-state';
import { NasaImagesFacade } from '@plastik/nasa-images/data-access';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';
import { PageEventConfig } from '@plastik/shared/table/entities';
import { take } from 'rxjs';

import { selectNasaImagesFeature } from './nasa-images.feature';

@Injectable()
export class NasaImagesSearchFacade extends NasaImagesFacade {
  images$ = this.store.pipe(select(selectNasaImagesFeature.selectAll));
  count$ = this.store.pipe(select(selectNasaImagesFeature.selectCount));
  isActiveSearch$ = this.store.pipe(select(selectNasaImagesFeature.selectIsActiveSearch));

  search(params: NasaImagesSearchApiParams): void {
    this.store.dispatch(
      routerActions.go({
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
        this.store.dispatch(
          routerActions.go({ path: [], extras: { queryParams: { ...queryParams, page: ++pageIndex }, queryParamsHandling: 'merge' } }),
        );
      });
  }
}
