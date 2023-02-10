import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { loadNasaImages } from './nasa-images.actions';
import * as NasaImagesSelectors from './nasa-images.selectors';

@Injectable()
export class NasaImagesFacade {
  private readonly store = inject(Store);

  loading$ = this.store.pipe(select(NasaImagesSelectors.selectNasaImagesLoading));
  allNasaImages$ = this.store.pipe(select(NasaImagesSelectors.selectAllNasaImages));

  // TODO: study to dispatch it in Effects on Route request action.
  load(): void {
    this.store.dispatch(loadNasaImages({ params: { q: 'pluto' } }));
  }
}
