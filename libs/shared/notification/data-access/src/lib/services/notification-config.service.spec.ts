import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NOTIFICATION_TYPES_CONFIG } from '@plastik/shared/notification/entities';

import { NotificationConfigService } from './notification-config.service';

describe('NotificationConfigService', () => {
  let service: NotificationConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        NotificationConfigService,
        {
          provide: NOTIFICATION_TYPES_CONFIG,
          useValue: {
            ['ERROR']: {
              type: 'ERROR',
              icon: 'error',
              action: 'close',
              duration: 5000,
            },
            ['WARNING']: {
              type: 'WARNING',
              icon: 'warning',
              duration: 5000,
            },
          },
        },
      ],
    });
    service = TestBed.inject(NotificationConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a custom formatted Notification configuration with provided Notification', () => {
    const instance = service.getInstance({ type: 'WARNING', message: 'Ok' });

    expect(instance).toEqual({
      type: 'WARNING',
      icon: 'warning',
      message: 'Ok',
      duration: 5000,
    });
  });
});
