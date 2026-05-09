import { BreakpointObserver } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PwaNavigationService } from './pwa-navigation.service';

describe('PwaNavigationService', () => {
  let service: PwaNavigationService;
  let breakpointObserver: BreakpointObserver;
  let platform: Platform;

  beforeEach(() => {
    const breakpointObserverMock = {
      observe: vi.fn().mockReturnValue(of({ matches: false })),
    };

    const platformMock = {
      IOS: false,
    };

    TestBed.configureTestingModule({
      providers: [
        PwaNavigationService,
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
        { provide: Platform, useValue: platformMock },
      ],
    });

    service = TestBed.inject(PwaNavigationService);
    breakpointObserver = TestBed.inject(BreakpointObserver);
    platform = TestBed.inject(Platform);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for isStandalone when not in standalone mode', () => {
    expect(service.isStandalone()).toBe(false);
  });

  it('should return true for isStandalone when media query matches', () => {
    vi.spyOn(breakpointObserver, 'observe').mockReturnValue(of({ matches: true, breakpoints: {} }));

    // Re-inject or re-create service to pick up the new mock if needed,
    // but since it's a signal based on an observable, it should update.
    // In this case, toSignal will pick up the initial value of the new observable.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaNavigationService,
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ matches: true, breakpoints: {} }) },
        },
        { provide: Platform, useValue: { IOS: false } },
      ],
    });
    service = TestBed.inject(PwaNavigationService);

    expect(service.isStandalone()).toBe(true);
  });

  it('should return true for isStandalone when on iOS and window.navigator.standalone is true', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaNavigationService,
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ matches: false, breakpoints: {} }) },
        },
        { provide: Platform, useValue: { IOS: true } },
      ],
    });

    // Mock window.navigator.standalone
    const originalNavigator = window.navigator;
    const navigatorSpy = vi.spyOn(window, 'navigator', 'get');
    navigatorSpy.mockReturnValue({
      ...originalNavigator,
      standalone: true,
    } as Navigator);

    service = TestBed.inject(PwaNavigationService);

    expect(service.isStandalone()).toBe(true);

    navigatorSpy.mockRestore();
  });
});
