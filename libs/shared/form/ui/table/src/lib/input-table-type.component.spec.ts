import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { InputTableTypeComponent } from './input-table-type.component';

describe('InputTableComponent', () => {
  let component: InputTableTypeComponent;
  let fixture: ComponentFixture<InputTableTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputTableTypeComponent,
        ReactiveFormsModule,
        FormlyMaterialModule,
        FormlyModule.forRoot(),
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTableTypeComponent);
    component = fixture.componentInstance;
    component.props.tableDefinition = signal({
      columnProperties: [],
      count: signal(0),
    });

    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
