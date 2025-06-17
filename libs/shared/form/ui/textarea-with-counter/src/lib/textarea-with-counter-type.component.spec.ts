import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { TextareaWithCounterTypeComponent } from './textarea-with-counter-type.component';

describe('TextareaWithCounterTypeComponent', () => {
  let component: TextareaWithCounterTypeComponent;
  let fixture: ComponentFixture<TextareaWithCounterTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'textarea-with-counter',
              component: TextareaWithCounterTypeComponent,
            },
          ],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaWithCounterTypeComponent);
    component = fixture.componentInstance;
    const fieldConfig = {
      key: 'textarea',
      type: 'textarea-with-counter',
      formControl: new FormControl(),
      props: {
        label: 'Textarea',
        placeholder: 'Enter text',
        required: true,
        maxLength: 100,
      },
    };
    component.field = fieldConfig;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
