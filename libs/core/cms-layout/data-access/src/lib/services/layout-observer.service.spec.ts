import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LayoutObserverService } from './layout-observer.service';

describe('LayoutObserverService', () => {
  let service: LayoutObserverService;
  const breakpointObserverMock = {
    observe: jest.fn().mockReturnValue(of({ matches: true })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LayoutObserverService,
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
      ],
    });
    service = TestBed.inject(LayoutObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return handset Matches based on BreakpointObserver', done => {
    service.getMatches().subscribe((matches: boolean) => {
      expect(matches).toBe(true);
      expect(breakpointObserverMock.observe).toHaveBeenCalledWith([
        Breakpoints.Handset,
        Breakpoints.Tablet,
        Breakpoints.Medium,
      ]);
      done();
    });
  });
});
