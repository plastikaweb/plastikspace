import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  NOTIFICATION_POSITION,
  NOTIFICATION_TYPES_CONFIG,
} from '@plastik/shared/notification/entities';
import { SharedNotificationUiHotToastComponent } from './shared-notification-ui-hot-toast.component';
import { SharedNotificationUiHotToastService } from './shared-notification-ui-hot-toast.service';

describe('SharedNotificationUiHotToastComponent', () => {
  let component: SharedNotificationUiHotToastComponent;
  let fixture: ComponentFixture<SharedNotificationUiHotToastComponent>;
  let toastService: SharedNotificationUiHotToastService;

  beforeEach(async () => {
    toastService = {
      show: vi.fn(),
    } as unknown as SharedNotificationUiHotToastService;

    await TestBed.configureTestingModule({
      imports: [SharedNotificationUiHotToastComponent, TranslateModule.forRoot()],
      providers: [
        { provide: SharedNotificationUiHotToastService, useValue: toastService },
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

  it('should call toastService.show when a notification is provided', async () => {
    const notification = { type: 'SUCCESS', message: 'Success' };
    fixture.componentRef.setInput('notification', notification);
    fixture.detectChanges();

    expect(toastService.show).toHaveBeenCalled();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
