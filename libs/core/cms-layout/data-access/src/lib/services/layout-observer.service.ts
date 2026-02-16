import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutObserverService {
  readonly #breakpointObserver = inject(BreakpointObserver);

  getMatches(
    breakpoints: string[] = [Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Medium]
  ): Observable<boolean> {
    return this.#breakpointObserver.observe(breakpoints).pipe(
      map((state: BreakpointState) => state.matches),
      shareReplay(1)
    );
  }
}
