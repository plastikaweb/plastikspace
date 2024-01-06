import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'plastik-shared-activity-ui-linear',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './shared-activity-ui-linear.component.html',
  styles: [
    `
      // ----- ProgressBar https://material.angular.io/components/progress-bar ----- //
      .mat-mdc-progress-bar {
        --mdc-linear-progress-track-color: var(--plastik-mdc-linear-progress-track-color, rgb(183, 183, 183)) !important;
        --mdc-linear-progress-track-height: var(--plastik-mdc-linear-progress-track-height, 4px) !important;
        --mdc-linear-progress-active-indicator-height: var(--plastik-mdc-linear-progress-active-indicator-height, 4px) !important;
        --mdc-linear-progress-active-indicator-color: var(--plastik-mdc-linear-progress-active-indicator-color, rgb(11, 17, 62)) !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedActivityUiLinearComponent {
  @Input() active = false;
  @Input() mode: ProgressBarMode = 'indeterminate';
}
