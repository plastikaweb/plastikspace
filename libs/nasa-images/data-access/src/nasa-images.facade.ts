import { inject, Injectable } from '@angular/core';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { RouterFacade } from '@plastik/core/router-state';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NasaImagesFacade extends RouterFacade {
  sidenavConfig = inject(VIEW_CONFIG);

  routeInfo$ = this.routeName$.pipe(map(name => this.sidenavConfig.find(routeData => routeData.name === name)));
}
