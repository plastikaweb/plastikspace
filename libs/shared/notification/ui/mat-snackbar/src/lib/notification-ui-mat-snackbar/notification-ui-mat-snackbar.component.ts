import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Notification } from '@plastik/shared/notification/entities';

@Component({
    selector: 'plastik-shared-notification-ui-mat-snackbar',
    imports: [MatIconModule],
    templateUrl: './notification-ui-mat-snackbar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationUiMatSnackbarComponent {
  constructor(
    public readonly snackBarRef: MatSnackBarRef<NotificationUiMatSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public readonly data: Notification
  ) {}

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
