import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { go } from '@plastik/core/router-state';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/entities';

import * as NasaImagesSelectors from './nasa-images.selectors';

@Injectable()
export class NasaImagesFacade {
  private readonly store = inject(Store);

  loading$ = this.store.pipe(select(NasaImagesSelectors.selectNasaImagesLoading));
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
}
