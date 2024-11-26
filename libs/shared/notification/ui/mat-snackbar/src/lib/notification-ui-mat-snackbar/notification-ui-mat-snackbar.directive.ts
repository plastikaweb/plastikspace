import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { Notification } from '@plastik/shared/notification/entities';
import { Subscription } from 'rxjs';
import { NotificationUiMatSnackbarComponent } from './notification-ui-mat-snackbar.component';

@Directive({
  selector: '[plastikSnackbar]',
  standalone: true,
})
export class NotificationUiMatSnackbarDirective implements OnChanges, OnDestroy {
  @Input('plastikSnackbar') config!: MatSnackBarConfig<Notification>;
  @Output() sendDismiss: EventEmitter<void> = new EventEmitter();

  private readonly subscriptions = new Subscription();

  constructor(
    @Inject(MatSnackBar) private readonly snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DEFAULT_OPTIONS) private readonly defaultSnackBarConfig: MatSnackBarConfig
  ) {}

  ngOnChanges({ config: { currentValue } }: SimpleChanges) {
    if (currentValue) {
      this.open({ ...this.defaultSnackBarConfig, ...currentValue });
    }
  }

  ngOnDestroy() {
    this.subscriptions?.unsubscribe();
    // this.snackBar.dismiss();
  }

  open(config: Notification) {
    // this.snackBar.dismiss();

    const snackBarConfig = {
      ...this.addNotificationMatSnackBarConfig(config),
      ...this.addTypeStyling(config),
    };
    this.snackBar.openFromComponent(NotificationUiMatSnackbarComponent, snackBarConfig);

    // this.subscriptions.add(snackBarRef.afterDismissed().subscribe(() => this.sendDismiss.emit()));
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
      panelClass: [...(containerClass || ''), 'message-box', `message-box-${type.toLowerCase()}`],
    };
  }
}
