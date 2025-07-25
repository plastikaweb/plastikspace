import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Notification } from '@plastik/shared/notification/entities';

import { NotificationUiMatSnackbarComponent } from './notification-ui-mat-snackbar.component';
import { NotificationUiMatSnackbarDirective } from './notification-ui-mat-snackbar.directive';

describe('NotificationUiMatSnackbarDirective', () => {
  let directive: NotificationUiMatSnackbarDirective;
  let snackBar: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    const mockSnackBar = {
      openFromComponent: jest.fn().mockReturnValue({
        afterDismissed: () => ({ subscribe: jest.fn() }),
        onAction: () => ({ subscribe: jest.fn() }),
        dismiss: jest.fn(),
      }),
      dismiss: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        NotificationUiMatSnackbarDirective,
        NotificationUiMatSnackbarComponent,
        NoopAnimationsModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MatSnackBar,
          useValue: mockSnackBar,
        },
        { provide: ComponentFixtureAutoDetect, useValue: true },
        {
          provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
          useValue: {
            duration: 5000,
          },
        },
      ],
    });

    TestBed.runInInjectionContext(() => {
      directive = new NotificationUiMatSnackbarDirective();
      snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    });
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('open', () => {
    it('should open the Snackbar with the given configuration and custom styling', () => {
      const config: Notification = { message: 'Test message', type: 'SUCCESS', duration: 1000 };
      const openFromComponentSpy = jest.spyOn(snackBar, 'openFromComponent');

      directive.open(config);

      expect(openFromComponentSpy).toHaveBeenCalledWith(NotificationUiMatSnackbarComponent, {
        data: { message: config.message, type: 'SUCCESS' },
        duration: 1000,
        panelClass: ['message-box', 'message-box-success'],
      });
    });
  });
});
