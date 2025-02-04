import { EMPTY } from 'rxjs';

import { Directive, effect, inject, input, OnDestroy, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Notification } from '@plastik/shared/notification/entities';

import { NotificationUiMatSnackbarComponent } from './notification-ui-mat-snackbar.component';

@Directive({
  selector: '[plastikSnackbar]',
})
export class NotificationUiMatSnackbarDirective implements OnDestroy {
  plastikSnackbar = input<Notification | null>(null);
  sendDismiss = output<void>();

  readonly #snackBar = inject(MatSnackBar);
  readonly #defaultSnackBarConfig = inject(MAT_SNACK_BAR_DEFAULT_OPTIONS);

  #currentSnackBarRef?: MatSnackBarRef<NotificationUiMatSnackbarComponent>;
  afterDismissed = toSignal(this.#currentSnackBarRef?.afterDismissed() || EMPTY);

  constructor() {
    effect(() => {
      const notification = this.plastikSnackbar();
      if (notification) {
        this.open(notification);
      } else {
        this.dismissCurrentSnackBar();
      }
    });

    if (this.afterDismissed()) {
      this.sendDismiss.emit();
      this.#currentSnackBarRef = undefined;
    }
  }

  ngOnDestroy() {
    this.dismissCurrentSnackBar();
  }

  private dismissCurrentSnackBar(): void {
    if (this.#currentSnackBarRef) {
      this.#currentSnackBarRef?.dismiss();
      this.#currentSnackBarRef = undefined;
    }
  }

  open(config: Notification): void {
    this.dismissCurrentSnackBar();
    const finalConfig = {
      ...this.#defaultSnackBarConfig,
      ...config,
    } as Notification;

    // Wait for next tick to ensure previous snackbar is fully dismissed
    const snackBarConfig = {
      ...this.addNotificationMatSnackBarConfig(finalConfig),
      ...this.addTypeStyling(finalConfig),
    };

    this.#currentSnackBarRef = this.#snackBar.openFromComponent(
      NotificationUiMatSnackbarComponent,
      snackBarConfig
    );
  }

  private addNotificationMatSnackBarConfig({
    duration,
    verticalPosition,
    horizontalPosition,
    ...data
  }: Notification): MatSnackBarConfig<Notification> {
    return {
      duration,
      verticalPosition,
      horizontalPosition,
      data,
    };
  }

  private addTypeStyling({ containerClass, type }: Notification) {
    return {
      panelClass: [...(containerClass || ''), 'message-box', `message-box-${type?.toLowerCase()}`],
    };
  }
}
