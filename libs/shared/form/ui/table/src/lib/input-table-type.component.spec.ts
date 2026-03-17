import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { BaseEntity } from '@plastik/core/entities';

import { InputTableProps } from './input-table-props';
import { InputTableTypeComponent } from './input-table-type.component';

describe('InputTableTypeComponent', () => {
  let component: InputTableTypeComponent;
  let fixture: ComponentFixture<InputTableTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [
        ReactiveFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'table',
              component: InputTableTypeComponent,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTableTypeComponent);
    component = fixture.componentInstance;
    const fieldConfig = {
      key: 'table',
      type: 'table',
      formControl: new FormControl(),
      props: {
        tableDefinition: {
          columnProperties: signal([]),
          getData: () => [],
          sort: signal(['', 'asc']),
          caption: '',
          count: signal(0),
          actions: {},
          noPagination: false,
        },
        tableRowValueConditionFn: () => true,
      },
    } as FieldTypeConfig<InputTableProps<BaseEntity>>;

    component.field = fieldConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
