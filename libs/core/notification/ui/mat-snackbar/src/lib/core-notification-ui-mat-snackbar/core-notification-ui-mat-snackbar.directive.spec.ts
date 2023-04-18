import { TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Notification, NotificationType } from '@plastik/core/notification/entities';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoreNotificationUiMatSnackbarComponent } from './core-notification-ui-mat-snackbar.component';
import { CoreNotificationUiMatSnackbarDirective } from './core-notification-ui-mat-snackbar.directive';

describe('CoreNotificationUiMatSnackbarDirective', () => {
  let directive: CoreNotificationUiMatSnackbarDirective;
  let snackBar: MatSnackBar;
  let defaultSnackBarConfig: MatSnackBarConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreNotificationUiMatSnackbarDirective, CoreNotificationUiMatSnackbarComponent, NoopAnimationsModule],
      providers: [
        MatSnackBar,
        {
          provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
          useValue: {},
        },
      ],
    });

    snackBar = TestBed.inject(MatSnackBar);
    defaultSnackBarConfig = TestBed.inject(MAT_SNACK_BAR_DEFAULT_OPTIONS);
    directive = new CoreNotificationUiMatSnackbarDirective(snackBar, defaultSnackBarConfig);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('open', () => {
    it('should open the Snackbar with the given configuration and custom styling', () => {
      const config: Notification = { message: 'Test message', type: NotificationType.Success, duration: 1000 };
      const openFromComponentSpy = jest.spyOn(snackBar, 'openFromComponent');

      directive.open(config);

      expect(openFromComponentSpy).toHaveBeenCalledWith(CoreNotificationUiMatSnackbarComponent, {
        data: { message: config.message, type: NotificationType.Success },
        duration: 1000,
        panelClass: ['message-box', 'message-box-success'],
      });
    });
  });
});
