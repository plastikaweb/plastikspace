import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ALERT_ICONS, AlertType } from '@plastik/core/entities';

@Component({
  selector: 'plastik-shared-alert',
  imports: [MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './shared-alert-ui.component.html',
  styleUrl: './shared-alert-ui.component.scss',
  host: {
    role: 'alert',
    'aria-live': 'polite',
    class:
      'plastik-alert relative flex flex-col md:flex-row gap-2 px-4 py-3 rounded-lg items-center',
    '[class]': 'hostClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedAlertUiComponent {
  /**
   * The semantic type of the alert. Controls color scheme and icon.
   */
  readonly type = input.required<AlertType>();

  /**
   * Optional Material icon name to override the default icon for the alert type.
   */
  readonly icon = input<string>('');

  /**
   * When true, a close button is rendered in the alert.
   */
  readonly closable = input<boolean>(false);

  /**
   * Emitted when the user clicks the close button.
   */
  readonly closed = output<void>();

  protected readonly resolvedIcon = computed(() => this.icon() || ALERT_ICONS[this.type()]);

  protected readonly hostClass = computed(
    () => `plastik-alert--${this.type().toLowerCase()} ${this.closable() ? 'closable' : ''}`
  );
}
