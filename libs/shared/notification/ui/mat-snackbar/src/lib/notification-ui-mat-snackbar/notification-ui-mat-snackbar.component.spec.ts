import { axe } from 'vitest-axe';

import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

import { NotificationUiMatSnackbarComponent } from './notification-ui-mat-snackbar.component';
import { NotificationUiMatSnackbarDirective } from './notification-ui-mat-snackbar.directive';

describe('NotificationUiMatSnackbarComponent', () => {
  let component: NotificationUiMatSnackbarComponent;
  let fixture: ComponentFixture<NotificationUiMatSnackbarComponent>;
  let matSnackBar: MatSnackBarRef<Notification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationUiMatSnackbarComponent, NotificationUiMatSnackbarDirective],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: vi.fn(),
          },
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationUiMatSnackbarComponent);
    component = fixture.componentInstance;
    matSnackBar = TestBed.inject(MatSnackBarRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dismiss method on snackBarRef on dismiss method call', () => {
    component.dismiss();
    expect(matSnackBar.dismiss).toHaveBeenCalled();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });
});

describe('NotificationUiMatSnackbarComponent — SEC-04: message XSS sink hardening', () => {
  const XSS_PAYLOAD = '<img src=x onerror="window.__xss=1"> bold <strong>text</strong>';

  let fixture: ComponentFixture<NotificationUiMatSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationUiMatSnackbarComponent, NotificationUiMatSnackbarDirective],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatSnackBarRef, useValue: { dismiss: vi.fn() } },
        { provide: MAT_SNACK_BAR_DATA, useValue: { message: XSS_PAYLOAD, type: 'ERROR' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationUiMatSnackbarComponent);
    fixture.detectChanges();
  });

  it('should render the message as inert text, never parsing it as HTML', () => {
    const host: HTMLElement = fixture.nativeElement;
    const paragraph = host.querySelector('p');

    // `{{ }}` interpolation must show the payload verbatim…
    expect(paragraph?.textContent).toContain(XSS_PAYLOAD);
    // …and no markup from the payload may materialise as real DOM nodes.
    expect(host.querySelector('img')).toBeNull();
    expect(paragraph?.querySelector('strong')).toBeNull();
    expect(paragraph?.innerHTML).not.toContain('<img');
  });
});
