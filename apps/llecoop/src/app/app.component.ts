import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { activityStore } from '@plastik/shared/activity/data-access';
import { SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { NotificationUiMatSnackbarDirective } from '@plastik/shared/notification/ui/mat-snackbar';

@Component({
  selector: 'plastik-root',
  imports: [
    RouterOutlet,
    SharedActivityUiOverlayComponent,
    MatProgressSpinnerModule,
    NotificationUiMatSnackbarDirective,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly notificationStore = inject(notificationStore);
  protected readonly activityStore = inject(activityStore);
}
