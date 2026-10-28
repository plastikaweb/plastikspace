import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { CoreCmsLayoutHeaderConfig } from '@plastik/core/cms-layout/entities';

/**
 * Renders the user account menu button and dropdown navigation items for CMS header layouts.
 */
@Component({
  selector: 'plastik-core-cms-layout-ui-user-menu',
  imports: [MatButton, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: './core-cms-layout-ui-user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutUiUserMenuComponent {
  /**
   * Header configuration detailing user menu label and navigation items.
   */
  readonly userMenuConfig = input.required<CoreCmsLayoutHeaderConfig['userMenuConfig']>();

  /**
   * Emits selected action handler from user menu dropdown items.
   */
  readonly sendAction = output<() => void>();

  /**
   * Executes and emits the selected action callback.
   * @param {() => void} action Action callback function.
   */
  onSendAction(action: () => void): void {
    this.sendAction.emit(action);
  }
}
