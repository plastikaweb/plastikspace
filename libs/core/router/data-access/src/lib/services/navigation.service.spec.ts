import { Location } from '@angular/common';
import { Component, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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
      providers: [
        provideExperimentalZonelessChangeDetection(),
        NavigationService,
        provideMockStore(),
        provideRouter([
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
    });
    service = TestBed.inject(NavigationService);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('navigate method', () => {
    it('router should navigate to the passed path with no query params', async () => {
      await service.navigate({ path: ['/custom'] });
      expect(location.path()).toBe('/custom');
    });

    it('router should navigate to the passed path with query params', async () => {
      await service.navigate({ path: ['/custom'], query: { id: 'aaaa' } });
      expect(location.path()).toBe('/custom?id=aaaa');
    });

    it('router should navigate to the passed path with fragment extras', async () => {
      await service.navigate({ path: ['/custom'], extras: { fragment: 'aaaa' } });
      expect(location.path(true)).toBe('/custom#aaaa');
    });
  });

  describe('back method', () => {
    it('router should redirect to the location last URL', async () => {
      await service.navigate({ path: ['/root'] });
      await service.navigate({ path: ['/custom'] });
      await service.back();
      expect(location.path()).toBe('/root');
    });

    it('router should redirect to the previous app route', async () => {
      await service.navigate({ path: ['/root'] });
      await service.navigate({ path: ['/custom'] });
      await service.back('/root');
      expect(location.path()).toBe('/root');
    });

    it('router should redirect to the previous app route that matches the regex', async () => {
      await service.navigate({ path: ['/other'] });
      await service.navigate({ path: ['/other?key=1'] });
      await service.navigate({ path: ['/custom'] });
      await service.back('/', /other/);
      expect(location.path()).toBe(`/other${encodeURIComponent('?key=1')}`);
    });

    it('router should redirect to the passed URL if no previous route exists', async () => {
      await service.back('/custom');
      expect(location.path()).toBe('/custom');
    });
  });
});
