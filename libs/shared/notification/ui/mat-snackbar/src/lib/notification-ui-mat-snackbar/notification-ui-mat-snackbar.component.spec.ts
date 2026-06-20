import { axe } from 'vitest-axe';

import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { NotificationUiMatSnackbarComponent } from './notification-ui-mat-snackbar.component';
import { NotificationUiMatSnackbarDirective } from './notification-ui-mat-snackbar.directive';

describe('NotificationUiMatSnackbarComponent', () => {
  let component: NotificationUiMatSnackbarComponent;
  let fixture: ComponentFixture<NotificationUiMatSnackbarComponent>;
  let matSnackBar: MatSnackBarRef<NotificationUiMatSnackbarComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NotificationUiMatSnackbarComponent,
        NotificationUiMatSnackbarDirective,
      ],
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

    translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      TEST_MESSAGE: 'Test message with {{ param }}',
    });
    translate.use('en');

    fixture = TestBed.createComponent(NotificationUiMatSnackbarComponent);
    component = fixture.componentInstance;
    matSnackBar = TestBed.inject(MatSnackBarRef);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call dismiss method on snackBarRef on dismiss method call', () => {
    fixture.detectChanges();
    component.dismiss();
    expect(matSnackBar.dismiss).toHaveBeenCalled();
  });

  it('should render translated message with parameters', () => {
    component.data = {
      message: 'TEST_MESSAGE',
      parameters: { param: 'interpolated value' },
      type: 'INFO',
    };
    fixture.detectChanges();

    const p = fixture.nativeElement.querySelector('p');
    expect(p.textContent).toBe('Test message with interpolated value');
  });

  it('should have no accessibility violations', async () => {
    fixture.detectChanges();
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
