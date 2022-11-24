import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RouterStateEffects } from './router-state.effects';

describe('RouterState Effects', () => {
  let actions$: Observable<Action>;
  let effects: RouterStateEffects;
  let metadata: EffectsMetadata<RouterStateEffects>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [RouterStateEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(RouterStateEffects);
    metadata = getEffectsMetadata(effects);
  });

  describe('navigate$', () => {
    it('should register navigate$ that dispatches no action', () => {
      expect(metadata.navigate$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
  });

  describe('navigateBack$', () => {
    it('should register navigateBack$ that dispatches no action', () => {
      expect(metadata.navigateBack$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
  });

  describe('navigateForward$', () => {
    it('should register navigateForward$ that dispatches no action', () => {
      expect(metadata.navigateForward$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });
  });
});
