import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';

import { YearPickerTypeComponent } from './year-picker-type.component';

describe('YearPickerTypeComponent', () => {
  let component: YearPickerTypeComponent;
  let fixture: ComponentFixture<YearPickerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'year',
              component: YearPickerTypeComponent,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(YearPickerTypeComponent);
    component = fixture.componentInstance;
    const fieldConfig = {
      key: 'year',
      type: 'year',
      formControl: new FormControl(),
      props: {
        label: 'Year',
        placeholder: 'Year',
      },
    };
    component.field = fieldConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
