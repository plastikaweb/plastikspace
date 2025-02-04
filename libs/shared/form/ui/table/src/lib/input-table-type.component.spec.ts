import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { BaseEntity } from '@plastik/core/entities';
import { TableDefinition } from '@plastik/shared/table/entities';

import { InputTableTypeComponent } from './input-table-type.component';

describe('InputTableTypeComponent', () => {
  let component: InputTableTypeComponent;
  let fixture: ComponentFixture<InputTableTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
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
        tableDefinition: {} as TableDefinition<BaseEntity>,
        tableRowValueConditionFn: () => true,
      },
    };
    component.field = fieldConfig;
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
