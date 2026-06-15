import { axe } from 'vitest-axe';

import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

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
          useValue: {
            message: 'test.message',
            parameters: { name: 'Sentinel' },
          },
        },
        provideTranslateService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationUiMatSnackbarComponent);
    component = fixture.componentInstance;
    matSnackBar = TestBed.inject(MatSnackBarRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dismiss method on snackBarRef on dismiss method call', () => {
    component.dismiss();
    expect(matSnackBar.dismiss).toHaveBeenCalled();
  });

  it('should translate message using TranslateService', () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { 'test.message': 'Translated message {{ name }}' });
    translate.use('en');

    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');
    expect(p.textContent).toContain('Translated message Sentinel');
  });

  it('should escape HTML in message via interpolation', () => {
    const translate = TestBed.inject(TranslateService);
    const xssPayload = '<img src=x onerror=alert(1)>';
    translate.setTranslation('en', { 'test.message': xssPayload });
    translate.use('en');

    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');
    expect(p.innerHTML).not.toContain('<img');
    expect(p.textContent).toBe(xssPayload);
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
