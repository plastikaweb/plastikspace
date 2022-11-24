import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NavigationService } from './navigation.service';

@Component({})
class RootComponent {}

@Component({})
class CustomComponent {}

@Component({})
class OtherComponent {}

@Component({})
class PanelComponent {}

describe('NavigationService', () => {
  let service: NavigationService;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'root',
            component: RootComponent,
          },
          {
            path: 'custom',
            component: CustomComponent,
          },
          {
            path: 'other',
            component: OtherComponent,
          },
          {
            path: 'other?key=1',
            component: OtherComponent,
          },
          {
            path: 'panel',
            component: PanelComponent,
            outlet: 'panel',
          },
          {
            path: '',
            redirectTo: 'root',
            pathMatch: 'full',
          },
        ]),
      ],
      providers: [provideMockStore()],
    });
    service = TestBed.inject(NavigationService);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('navigate method', () => {
    it('router should navigate to the passed path with no query params', fakeAsync(() => {
      service.navigate({ path: ['/custom'] });
      tick();
      expect(location.path()).toBe('/custom');
    }));

    it('router should navigate to the passed path with query params', fakeAsync(() => {
      service.navigate({ path: ['/custom'], query: { id: 'aaaa' } });
      tick();
      expect(location.path()).toBe('/custom?id=aaaa');
    }));

    it('router should navigate to the passed path with fragment extras', fakeAsync(() => {
      service.navigate({ path: ['/custom'], extras: { fragment: 'aaaa' } });
      tick();
      expect(location.path()).toBe('/custom#aaaa');
    }));
  });

  describe('back method', () => {
    it('router should redirect to the location last URL', fakeAsync(() => {
      service.navigate({ path: ['/root'] });
      tick();
      service.navigate({ path: ['/custom'] });
      tick();
      service.back();
      tick();
      expect(location.path()).toBe('/root');
    }));

    it('router should redirect to the previous app route', fakeAsync(() => {
      service.navigate({ path: ['/root'] });
      tick();
      service.navigate({ path: ['/custom'] });
      tick();
      service.back('/root');
      tick();
      expect(location.path()).toBe('/root');
    }));

    it('router should redirect to the previous app route that matches the regex', fakeAsync(() => {
      service.navigate({ path: ['/other'] });
      tick();
      service.navigate({ path: ['/other?key=1'] });
      tick();
      service.navigate({ path: ['/custom'] });
      tick();
      service.back('/', /other/);
      tick();
      expect(location.path()).toBe(`/other${encodeURIComponent('?key=1')}`);
    }));

    it('router should redirect to the passed URL if no previous route exists', fakeAsync(() => {
      service.back('/custom');
      tick();
      expect(location.path()).toBe('/custom');
    }));
  });
});
