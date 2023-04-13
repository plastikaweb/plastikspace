import { TestBed } from '@angular/core/testing';

import { NotificationType } from '@plastik/core/notification/entities';
import { NOTIFICATION_TYPES_CONFIG, defaultNotification } from './notification-config';
import { NotificationConfigService } from './notification-config.service';

describe('NotificationConfigService', () => {
  let service: NotificationConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationConfigService, { provide: NOTIFICATION_TYPES_CONFIG, useValue: defaultNotification }],
    });
    service = TestBed.inject(NotificationConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a custom formatted Notification configuration with provided Notification', () => {
    const instance = service.getInstance({ type: NotificationType.Warning, message: 'Ok' });

    expect(instance).toEqual({
      type: NotificationType.Warning,
      icon: 'warning',
      message: 'Ok',
      duration: 5000,
    });
  });
});
