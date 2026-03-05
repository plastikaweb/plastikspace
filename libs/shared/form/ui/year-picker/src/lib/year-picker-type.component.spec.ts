import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { YearPickerTypeComponent } from './year-picker-type.component';

describe('YearPickerTypeComponent', () => {
  let component: YearPickerTypeComponent;
  let fixture: ComponentFixture<YearPickerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [
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
