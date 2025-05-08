import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { InputPasswordWithVisibilityTypeComponent } from './input-password-with-visibility-type.component';

describe('InputPasswordWithVisibilityTypeComponent', () => {
  let component: InputPasswordWithVisibilityTypeComponent;
  let fixture: ComponentFixture<InputPasswordWithVisibilityTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [
        ReactiveFormsModule,
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
});
