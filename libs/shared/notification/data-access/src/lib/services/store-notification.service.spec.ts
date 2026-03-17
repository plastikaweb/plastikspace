import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { notificationStore } from '../+state/notification.store';
import { NotificationConfigService } from './notification-config.service';
import { StoreNotificationService } from './store-notification.service';

describe('StoreNotificationService', () => {
  let service: StoreNotificationService;
  let configService: NotificationConfigService;
  let store: any;
  let announcer: LiveAnnouncer;

  beforeEach(() => {
    const storeSpy = {
      show: vi.fn(),
    };

    const announcerSpy = {
      announce: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        StoreNotificationService,
        { provide: NotificationConfigService, useValue: { getInstance: vi.fn(c => c) } },
        { provide: notificationStore, useValue: storeSpy },
        { provide: LiveAnnouncer, useValue: announcerSpy },
      ],
    });

    service = TestBed.inject(StoreNotificationService);
    configService = TestBed.inject(NotificationConfigService);
    store = TestBed.inject(notificationStore);
    announcer = TestBed.inject(LiveAnnouncer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('should call notificationStore.show and LiveAnnouncer.announce', () => {
      const message = 'Test message';
      const type = 'SUCCESS';
      const parameters = { foo: 'bar' };

      service.create(message, type, parameters);

      expect(configService.getInstance).toHaveBeenCalledWith({ message, type, parameters });
      expect(store.show).toHaveBeenCalledWith({ message, type, parameters }, true);
      expect(announcer.announce).toHaveBeenCalledWith(message, 'assertive', 1000);
    });

    it('should call notificationStore.show with preserve false when specified', () => {
      const message = 'Test message';
      const type = 'ERROR';

      service.create(message, type, {}, false);

      expect(store.show).toHaveBeenCalledWith({ message, type, parameters: {} }, false);
    });
  });
});
