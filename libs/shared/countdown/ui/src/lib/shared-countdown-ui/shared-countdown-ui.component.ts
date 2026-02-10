import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'plastik-countdown',
  imports: [TranslatePipe],
  templateUrl: './shared-countdown-ui.component.html',
  styleUrl: './shared-countdown-ui.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedCountdownUiComponent {
  readonly segments = input<string[]>([]);
  readonly prefix = input<string>('');
  readonly class = input<string>('');
}
