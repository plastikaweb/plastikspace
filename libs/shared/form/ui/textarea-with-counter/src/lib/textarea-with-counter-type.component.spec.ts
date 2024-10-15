import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { TextareaWithCounterTypeComponent } from './textarea-with-counter-type.component';

describe('TextareaWithCounterTypeComponent', () => {
  let component: TextareaWithCounterTypeComponent;
  let fixture: ComponentFixture<TextareaWithCounterTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TextareaWithCounterTypeComponent,
        ReactiveFormsModule,
        FormlyMaterialModule,
        FormlyModule.forRoot(),
        MatInputModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaWithCounterTypeComponent);
    component = fixture.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
