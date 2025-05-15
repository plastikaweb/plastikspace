import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsActive } from '@plastik/shared/activity/data-access';
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
  readonly #store = inject(Store);
  readonly #liveAnnouncer = inject(LiveAnnouncer);
  protected readonly notificationStore = inject(notificationStore);
  protected readonly isActive = toSignal(this.#store.select(selectIsActive));

  constructor() {
    effect(() => {
      if (this.isActive()) {
        this.#liveAnnouncer.announce('Carregant dades...', 'assertive', 100);
      }
    });
  }
}
