import { LiveAnnouncer } from '@angular/cdk/a11y';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { notificationStore } from '../+state/notification.store';
import { StoreNotificationService } from './store-notification.service';

describe('StoreNotificationService', () => {
  const setup = () => {
    const announce = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        StoreNotificationService,
        { provide: LiveAnnouncer, useValue: { announce } },
      ],
    });

    return {
      service: TestBed.inject(StoreNotificationService),
      store: TestBed.inject(notificationStore),
      announce,
    };
  };

  it('should be created', () => {
    expect(setup().service).toBeTruthy();
  });

  it('shows a basic notification and announces it to assistive technology', () => {
    const { service, store, announce } = setup();

    service.create('hello', 'SUCCESS');

    const config = store.configuration();

    expect(config).toHaveLength(1);
    expect(config[0]).toMatchObject({ message: 'hello', type: 'SUCCESS' });
    expect(announce).toHaveBeenCalledWith('hello', 'assertive', 1000);
  });

  it('forwards the groupKey so the store can collapse duplicates', () => {
    const { service, store } = setup();

    service.create('msg', 'INFO', { groupKey: 'cart:1' });

    expect(store.configuration()[0].groupKey).toBe('cart:1');
  });

  it('overrides the per-type duration when a duration option is provided', () => {
    const { service, store } = setup();

    service.create('msg', 'INFO', { duration: 12345 });

    expect(store.configuration()[0].duration).toBe(12345);
  });

  it('keeps the per-type default duration when no duration option is given', () => {
    const { service, store } = setup();

    // INFO default duration is 3000 (see defaultNotification).
    service.create('msg', 'INFO');

    expect(store.configuration()[0].duration).toBe(3000);
  });

  it('forwards render parameters as the last argument', () => {
    const { service, store } = setup();

    service.create('msg', 'SUCCESS', { groupKey: 'k' }, { name: 'Tomata', image: 'x.png' });

    expect(store.configuration()[0].parameters).toEqual({ name: 'Tomata', image: 'x.png' });
  });

  it('maps the preserve option onto preserveOnRouteRequest (defaulting to true)', () => {
    const { service, store } = setup();

    service.create('kept', 'INFO');
    expect(store.preserveOnRouteRequest()).toBe(true);

    service.create('not-kept', 'INFO', { preserve: false });
    expect(store.preserveOnRouteRequest()).toBe(false);
  });
});
