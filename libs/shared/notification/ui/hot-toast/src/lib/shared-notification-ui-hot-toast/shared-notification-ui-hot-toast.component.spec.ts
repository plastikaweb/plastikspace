import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  Notification,
  NOTIFICATION_POSITION,
  NOTIFICATION_TYPES_CONFIG,
} from '@plastik/shared/notification/entities';
import { Subject } from 'rxjs';
import { SharedNotificationUiHotToastComponent } from './shared-notification-ui-hot-toast.component';
import { SharedNotificationUiHotToastService } from './shared-notification-ui-hot-toast.service';

describe('SharedNotificationUiHotToastComponent', () => {
  let component: SharedNotificationUiHotToastComponent;
  let fixture: ComponentFixture<SharedNotificationUiHotToastComponent>;
  let afterClosed: Subject<unknown>;
  let toastRef: {
    afterClosed: Subject<unknown>;
    updateMessage: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
  };
  let show: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    afterClosed = new Subject();
    toastRef = { afterClosed, updateMessage: vi.fn(), close: vi.fn() };
    show = vi.fn().mockReturnValue(toastRef);

    await TestBed.configureTestingModule({
      imports: [SharedNotificationUiHotToastComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: SharedNotificationUiHotToastService,
          useValue: { show } as unknown as SharedNotificationUiHotToastService,
        },
        {
          provide: NOTIFICATION_TYPES_CONFIG,
          useValue: { SUCCESS: { type: 'SUCCESS' }, ERROR: { type: 'ERROR' } },
        },
        { provide: NOTIFICATION_POSITION, useValue: { verticalPosition: 'bottom' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedNotificationUiHotToastComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('notification', null);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the toast once when a notification is provided', () => {
    fixture.componentRef.setInput('notification', { type: 'SUCCESS', message: 'Success', id: 'k' });
    fixture.detectChanges();

    expect(show).toHaveBeenCalledTimes(1);
  });

  it('updates the existing toast in place on change instead of showing a second toast', () => {
    fixture.componentRef.setInput('notification', {
      type: 'SUCCESS',
      message: 'added',
      id: 'cart:1',
    });
    fixture.detectChanges();

    fixture.componentRef.setInput('notification', {
      type: 'SUCCESS',
      message: 'updated',
      id: 'cart:1',
    });
    fixture.detectChanges();

    expect(show).toHaveBeenCalledTimes(1);
    expect(toastRef.updateMessage).toHaveBeenCalled();
  });

  it('emits sendDismiss when the toast closes so the store can drop the entry', () => {
    const notification = { type: 'SUCCESS', message: 'added', id: 'cart:1' } as Notification;
    const dismissed: Notification[] = [];
    component.sendDismiss.subscribe(n => dismissed.push(n));

    fixture.componentRef.setInput('notification', notification);
    fixture.detectChanges();

    afterClosed.next({ id: 'cart:1' });

    expect(dismissed).toHaveLength(1);
    expect(dismissed[0].id).toBe('cart:1');
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
