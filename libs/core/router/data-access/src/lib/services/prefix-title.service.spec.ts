import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';
import { provideEnvironmentMock } from '@plastik/core/environments';

import { PrefixTitleService } from './prefix-title.service';

describe('PrefixTitleService', () => {
  let service: PrefixTitleService;
  let routerStateSnapshot: RouterStateSnapshot;
  let titleService: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        PrefixTitleService,
        provideEnvironmentMock(),
        Title,
        {
          provide: RouterStateSnapshot,
          useValue: {
            toString: jest.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(PrefixTitleService);
    routerStateSnapshot = TestBed.inject(RouterStateSnapshot);
    titleService = TestBed.inject(Title);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a route title based on environment name and route snapshot title', () => {
    jest.spyOn(service, 'buildTitle').mockImplementation(() => 'section');
    service.updateTitle(routerStateSnapshot);
    expect(titleService.getTitle()).toBe(`my-app - section`);
  });
});
