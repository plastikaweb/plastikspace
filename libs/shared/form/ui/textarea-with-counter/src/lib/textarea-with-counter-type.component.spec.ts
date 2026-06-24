import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { provideTranslateService } from '@ngx-translate/core';
import { FormlyModule } from '@ngx-formly/core';

import { TextareaWithCounterTypeComponent } from './textarea-with-counter-type.component';

describe('TextareaWithCounterTypeComponent', () => {
  let component: TextareaWithCounterTypeComponent;
  let fixture: ComponentFixture<TextareaWithCounterTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideTranslateService()],
      imports: [
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

  test('should expose aria-live="polite" on the character counter hint', () => {
    const hint = fixture.nativeElement.querySelector('mat-hint');
    expect(hint.getAttribute('aria-live')).toBe('polite');
  });

  test('should apply text-warning (not text-error) when the count reaches 90% of maxLength', () => {
    component.formControl.setValue('a'.repeat(90));
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('mat-hint');
    expect(hint.classList.contains('text-warning')).toBe(true);
    expect(hint.classList.contains('text-error')).toBe(false);
  });

  test('should apply text-error (not text-warning) when the count reaches maxLength', () => {
    const maxLength = 100;
    component.formControl.setValue('a'.repeat(maxLength));
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('mat-hint');
    expect(hint.classList.contains('text-error')).toBe(true);
    expect(hint.classList.contains('text-warning')).toBe(false);
  });

  test('should apply neither warning nor error below 90% of maxLength', () => {
    component.formControl.setValue('a'.repeat(89));
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('mat-hint');
    expect(hint.classList.contains('text-warning')).toBe(false);
    expect(hint.classList.contains('text-error')).toBe(false);
  });
});
