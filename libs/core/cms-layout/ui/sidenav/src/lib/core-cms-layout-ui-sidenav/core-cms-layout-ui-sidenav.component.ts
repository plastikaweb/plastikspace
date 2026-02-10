import { ChangeDetectionStrategy, Component, inject, input, NgZone, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { LayoutPosition } from '@plastik/shared/entities';

@Component({
  selector: 'plastik-core-cms-layout-ui-sidenav',
  imports: [RouterOutlet, MatSidenavModule, MatListModule],
  templateUrl: './core-cms-layout-ui-sidenav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutUiSidenavComponent {
  readonly #zone = inject(NgZone);

  position = input<LayoutPosition>('start');
  mode = input<MatDrawerMode>('over');
  fixedInViewport = input(false);
  sidenavOpened = input(true);
  toggleSidenav = output<boolean | undefined>();

  onToggleSidenav(opened?: boolean): void {
    this.#zone.run(() => {
      this.toggleSidenav.emit(opened);
    });
  }
}
