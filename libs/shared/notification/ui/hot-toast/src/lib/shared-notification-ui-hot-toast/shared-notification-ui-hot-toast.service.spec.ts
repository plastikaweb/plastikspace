import { provideZonelessChangeDetection, TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HotToastService } from '@ngxpert/hot-toast';
import { describe, expect, it, vi } from 'vitest';
import { Subject } from 'rxjs';

import { SharedNotificationUiHotToastService } from './shared-notification-ui-hot-toast.service';

describe('SharedNotificationUiHotToastService', () => {
  const setup = () => {
    const ref = { afterClosed: new Subject(), updateMessage: vi.fn(), close: vi.fn() };
    const show = vi.fn().mockReturnValue(ref);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        SharedNotificationUiHotToastService,
        { provide: HotToastService, useValue: { show, close: vi.fn() } },
      ],
    });

    return { service: TestBed.inject(SharedNotificationUiHotToastService), show, ref };
  };

  const template = {} as TemplateRef<unknown>;

  it('keys the hot-toast library off the notification stable id', () => {
    const { service, show } = setup();

    service.show({ message: 'm', type: 'SUCCESS', id: 'cart:1' }, template);

    expect(show).toHaveBeenCalledTimes(1);
    expect(show.mock.calls[0][1]).toMatchObject({ id: 'cart:1' });
  });

  it('maps vertical/horizontal position into a hot-toast position', () => {
    const { service, show } = setup();

    service.show(
      { message: 'm', type: 'INFO', verticalPosition: 'top', horizontalPosition: 'right' },
      template
    );

    expect(show.mock.calls[0][1]).toMatchObject({ position: 'top-right' });
  });

  it('returns the created toast ref for the caller to manage', () => {
    const { service, ref } = setup();

    expect(service.show({ message: 'm', type: 'INFO', id: 'x' }, template)).toBe(ref);
  });
});
