import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'plastik-ui-order-status-chip',
  imports: [MatChipsModule, MatIconModule, NgClass],
  templateUrl: './ui-order-status-chip.component.html',
  styleUrl: './ui-order-status-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiOrderStatusChipComponent {
  chipClass = input('my-sm');
  iconClass = input('');
  icon = input.required<string>();
  label = input.required<string>();
  labelClass = input('font-bold');
}
