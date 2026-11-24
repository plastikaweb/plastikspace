import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'plastik-ui-order-status-chip',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './ui-order-status-chip.component.html',
  styleUrl: './ui-order-status-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiOrderStatusChipComponent {
  readonly chipClass = input('my-sm');
  readonly iconClass = input('');
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly labelClass = input('font-bold');
}
