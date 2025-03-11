import { Observable, of } from 'rxjs';

import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { RouterStateEffects } from './router-state.effects';

describe('RouterState Effects', () => {
  const actions$: Observable<Action> = of({ type: '' });
  let effects: RouterStateEffects;
  let metadata: EffectsMetadata<RouterStateEffects>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouterStateEffects,
        provideRouter([]),
        provideMockStore(),
        provideMockActions(() => actions$),
        provideExperimentalZonelessChangeDetection(),
      ],
    });

    effects = TestBed.inject(RouterStateEffects);
    metadata = getEffectsMetadata(effects);
  });

  it('should register navigate$ that dispatches no action', () => {
    expect(metadata.navigate$).toEqual({
      dispatch: false,
      useEffectsErrorHandler: true,
    });
  });

  it('should register navigateBack$ that dispatches no action', () => {
    expect(metadata.navigateBack$).toEqual({
      dispatch: false,
      useEffectsErrorHandler: true,
    });
  });

  it('should register navigateForward$ that dispatches no action', () => {
    expect(metadata.navigateForward$).toEqual({
      dispatch: false,
      useEffectsErrorHandler: true,
    });
  });

  test('should register scrollToTop$ that dispatches no action', () => {
    expect(metadata.scrollToTop$).toEqual({
      dispatch: false,
      useEffectsErrorHandler: true,
    });
  });
});
