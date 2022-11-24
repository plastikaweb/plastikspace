import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { provideMockStore } from '@ngrx/store/testing';
import { of, Subscription } from 'rxjs';

import { selectRouteDataName } from '../+state/selectors/router-state.selectors';
import { NavigationFilterService } from './navigation-filter.service';

@Component({})
class RootComponent {}

describe('NavigationFilterService', () => {
  let service: NavigationFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'valid',
            component: RootComponent,
          },
        ]),
      ],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectRouteDataName, value: 'valid' }],
        }),
      ],
    });
    service = TestBed.inject(NavigationFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkRouterNavigation method', () => {
    let streamOn: boolean;
    function routerNavigationMocked(url: string): Subscription {
      return of({
        type: ROUTER_NAVIGATION,
      })
        .pipe(service.checkRouterNavigation(url))
        .subscribe({
          next: () => (streamOn = true),
        });
    }

    it('should allow to continue the stream if view matches', () => {
      streamOn = false;
      routerNavigationMocked('valid');

      expect(streamOn).toBeTruthy();
    });

    it('should not allow to continue the stream if view does not match', () => {
      streamOn = false;
      routerNavigationMocked('not-valid');

      expect(streamOn).toBeFalsy();
    });
  });
});
