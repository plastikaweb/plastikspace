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
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationUiMatSnackbarComponent, NotificationUiMatSnackbarDirective],
      providers: [
        provideZonelessChangeDetection(),
        provideTranslateService(),
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
      ],
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    translate.setTranslation('ca', { 'test.message': 'Hola {{name}}' });
    translate.use('ca');

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

  it('should translate and interpolate the message', () => {
    const p = fixture.nativeElement.querySelector('p');
    expect(p.textContent).toContain('Hola Sentinel');
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
