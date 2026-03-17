import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/entities';

@Component({
  selector: 'plastik-core-cms-layout-ui-user-menu',
  imports: [MatButton, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: './core-cms-layout-ui-user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutUiUserMenuComponent {
  userMenuConfig = input.required<CoreCmsLayoutHeaderConfig['userMenuConfig']>();
  sendAction = output<() => void>();

  onSendAction(action: () => void): void {
    this.sendAction.emit(action);
  }
}
