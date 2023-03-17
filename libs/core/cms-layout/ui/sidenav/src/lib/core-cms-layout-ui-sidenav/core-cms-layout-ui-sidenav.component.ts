import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { LayoutPosition } from '@plastik/shared/entities';

@Component({
  selector: 'plastik-core-cms-layout-ui-sidenav',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatListModule],
  templateUrl: './core-cms-layout-ui-sidenav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutUiSidenavComponent {
  @Input() position: LayoutPosition = 'start';
  @Input() mode: MatDrawerMode = 'over';
  @Input() fixedInViewport = false;
  @Input() sidenavOpened = true;
  @Output() toggleSidenav: EventEmitter<boolean> = new EventEmitter<boolean>();

  onToggleSidenav(opened?: boolean): void {
    this.toggleSidenav.emit(opened);
  }
}
