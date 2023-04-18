import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Notification } from '@plastik/core/notification/entities';

@Component({
  selector: 'plastik-core-notification-ui-mat-snackbar',
  standalone: true,
  imports: [NgIf, MatIconModule],
  templateUrl: './core-notification-ui-mat-snackbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreNotificationUiMatSnackbarComponent {
  constructor(
    public readonly snackBarRef: MatSnackBarRef<CoreNotificationUiMatSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public readonly data: Notification,
  ) {}

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
