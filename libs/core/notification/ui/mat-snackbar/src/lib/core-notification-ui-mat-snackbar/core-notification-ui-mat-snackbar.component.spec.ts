import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CoreNotificationUiMatSnackbarComponent } from './core-notification-ui-mat-snackbar.component';

describe('CoreNotificationUiMatSnackbarComponent', () => {
  let component: CoreNotificationUiMatSnackbarComponent;
  let fixture: ComponentFixture<CoreNotificationUiMatSnackbarComponent>;
  let matSnackBar: MatSnackBarRef<Notification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreNotificationUiMatSnackbarComponent],
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: jest.fn(),
          },
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreNotificationUiMatSnackbarComponent);
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
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
