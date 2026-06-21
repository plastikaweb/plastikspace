import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { InputPasswordWithVisibilityTypeComponent } from './input-password-with-visibility-type.component';
import { TranslateModule } from '@ngx-translate/core';

describe('InputPasswordWithVisibilityTypeComponent', () => {
  let component: InputPasswordWithVisibilityTypeComponent;
  let fixture: ComponentFixture<InputPasswordWithVisibilityTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        FormlyModule.forRoot({
          types: [
            {
              name: 'password-with-visibility',
              component: InputPasswordWithVisibilityTypeComponent,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InputPasswordWithVisibilityTypeComponent);
    component = fixture.componentInstance;
    const fieldConfig = {
      key: 'password',
      type: 'password-with-visibility',
      formControl: new FormControl(),
      props: {
        type: 'password',
        label: 'Contrasenya',
        placeholder: 'Contrasenya',
        required: true,
        minLength: 8,
        maxLength: 25,
      },
    };
    component.field = fieldConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility when hidePassword is called', () => {
    const initialVisibility = component.hiddenPass();
    const event = new Event('click');

    component.hidePassword(event);

    expect(component.hiddenPass()).toBe(!initialVisibility);
  });

  it('should sync aria-label, tooltip and aria-pressed with visibility state', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('aria-label')).toBe('common.form.showPassword');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    component.hidePassword(new Event('click'));
    fixture.detectChanges();

    expect(button.getAttribute('aria-label')).toBe('common.form.hidePassword');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('should keep the visibility toggle in the keyboard tab order (A11Y-006, WCAG 2.1.1)', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    // No `tabindex="-1"`: the native button stays reachable by keyboard.
    expect(button.getAttribute('tabindex')).toBeNull();
    expect(button.tabIndex).toBe(0);
  });
});
