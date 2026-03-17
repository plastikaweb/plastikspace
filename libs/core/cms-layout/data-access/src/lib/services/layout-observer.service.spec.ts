import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { LayoutObserverService } from './layout-observer.service';

describe('LayoutObserverService', () => {
  let service: LayoutObserverService;
  const breakpointObserverMock = {
    observe: vi.fn().mockReturnValue(of({ matches: true })),
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

  it('should return handset Matches based on BreakpointObserver', async () => {
    const matches = await firstValueFrom(service.getMatches());
    expect(matches).toBe(true);
    expect(breakpointObserverMock.observe).toHaveBeenCalledWith([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Medium,
    ]);
  });
});
