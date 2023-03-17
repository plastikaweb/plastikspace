import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'plastik-shared-activity-ui-linear',
  standalone: true,
  imports: [MatProgressBarModule, NgIf],
  templateUrl: './shared-activity-ui-linear.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedActivityUiLinearComponent {
  @Input() active = false;
  @Input() mode: ProgressBarMode = 'indeterminate';
}
