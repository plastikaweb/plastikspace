import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as NasaImagesSelectors from './nasa-images.selectors';

@Injectable()
export class NasaImagesFacade {
  private readonly store = inject(Store);

  loading$ = this.store.pipe(select(NasaImagesSelectors.selectNasaImagesLoading));
  images$ = this.store.pipe(select(NasaImagesSelectors.selectAllNasaImages));
  count$ = this.store.pipe(select(NasaImagesSelectors.selectNasaImagesCount));
}
