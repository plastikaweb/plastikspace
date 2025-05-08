import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { InputColorPickerTypeComponent } from './input-color-picker-type.component';

describe('InputColorPickerTypeComponent', () => {
  let component: InputColorPickerTypeComponent;
  let fixture: ComponentFixture<InputColorPickerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [
        ReactiveFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'color-picker',
              component: InputColorPickerTypeComponent,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InputColorPickerTypeComponent);
    component = fixture.componentInstance;
    const fieldConfig = {
      key: 'color',
      type: 'color-picker',
      formControl: new FormControl(),
      props: {
        acceptLabel: 'Aceptar',
        cancelLabel: 'Cancelar',
        colorPalette: ['#FF0000', '#00FF00', '#0000FF'],
        hideColorPicker: false,
        hideTextInput: false,
      },
    };
    component.field = fieldConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
