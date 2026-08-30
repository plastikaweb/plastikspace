import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Notification, NOTIFICATION_MAX_CONCURRENT } from '@plastik/shared/notification/entities';

import { notificationStore } from './notification.store';

describe('notificationStore', () => {
  const notification = (overrides: Partial<Notification> = {}): Notification => ({
    message: 'message',
    type: 'INFO',
    ...overrides,
  });

  const setup = (maxConcurrent = 3) => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: NOTIFICATION_MAX_CONCURRENT, useValue: maxConcurrent },
      ],
    });

    return TestBed.inject(notificationStore);
  };

  it('appends notifications without a groupKey, assigning each a distinct id', () => {
    const store = setup();

    store.show(notification({ message: 'a' }));
    store.show(notification({ message: 'b' }));

    const config = store.configuration();

    expect(config).toHaveLength(2);
    expect(config[0].id).not.toBe(config[1].id);
  });

  it('refreshes a grouped notification in place while it is already the most recent toast', () => {
    const store = setup();

    store.show(notification({ message: 'added', groupKey: 'cart:1' }));
    const firstId = store.configuration()[0].id;

    store.show(notification({ message: 'updated', groupKey: 'cart:1' }));

    const config = store.configuration();

    expect(config).toHaveLength(1);
    expect(config[0].message).toBe('updated');
    expect(config[0].groupKey).toBe('cart:1');
    // Stable id keeps the UI updating the same toast in place (no restacking).
    expect(config[0].id).toBe(firstId);
  });

  it('restacks with a fresh id when a same-groupKey notification changes type', () => {
    const store = setup();

    store.show(notification({ message: 'ok', type: 'SUCCESS', groupKey: 'op:create' }));
    const successId = store.configuration()[0].id;

    store.show(notification({ message: 'failed', type: 'ERROR', groupKey: 'op:create' }));

    const config = store.configuration();

    expect(config).toHaveLength(1);
    expect(config[0].type).toBe('ERROR');
    expect(config[0].message).toBe('failed');
    // A fresh id forces the UI to re-show the toast so the error styling/duration apply.
    expect(config[0].id).not.toBe(successId);
  });

  it('moves an older grouped notification to the top of the stack when it is updated', () => {
    const store = setup();

    store.show(notification({ message: 'a1', groupKey: 'a' }));
    store.show(notification({ message: 'b1', groupKey: 'b' }));
    store.show(notification({ message: 'a2', groupKey: 'a' }));

    const config = store.configuration();

    expect(config).toHaveLength(2);
    expect(config.map(n => n.groupKey)).toEqual(['b', 'a']);
    expect(config[1].message).toBe('a2');
  });

  it('caps retained notifications at the configured maximum, dropping the oldest', () => {
    const store = setup(2);

    store.show(notification({ message: 'a' }));
    store.show(notification({ message: 'b' }));
    store.show(notification({ message: 'c' }));

    const config = store.configuration();

    expect(config).toHaveLength(2);
    expect(config.map(n => n.message)).toEqual(['b', 'c']);
  });

  it('dismiss(id) removes only the matching notification', () => {
    const store = setup();

    store.show(notification({ message: 'a', groupKey: 'k:a' }));
    store.show(notification({ message: 'b', groupKey: 'k:b' }));
    const [first, second] = store.configuration();

    store.dismiss(first.id);

    const config = store.configuration();

    expect(config).toHaveLength(1);
    expect(config[0].id).toBe(second.id);
  });

  it('dismiss() with no id clears every notification', () => {
    const store = setup();

    store.show(notification({ message: 'a' }));
    store.show(notification({ message: 'b' }));
    store.dismiss();

    expect(store.configuration()).toHaveLength(0);
  });
});
