import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'plastik-countdown',
  imports: [TranslatePipe],
  templateUrl: './shared-countdown-ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'timer',
    'aria-live': 'polite',
    class: 'inline-flex',
  },
})
export class SharedCountdownUiComponent {
  readonly segments = input<string[]>([]);
  readonly prefix = input<string>('');
  readonly class = input<string>('');
}
