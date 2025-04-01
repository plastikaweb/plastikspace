import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TABLE_WITH_FILTERING_FACADE } from './table-with-filtering-facade.type';
import { TableWithFilteringComponent } from './table-with-filtering.component';

describe('TableWithFilteringComponent', () => {
  let component: TableWithFilteringComponent;
  let fixture: ComponentFixture<TableWithFilteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWithFilteringComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: TABLE_WITH_FILTERING_FACADE,
          useValue: {
            tableDefinition: {
              columnProperties: signal([]),
              count: signal(0),
              pagination: signal({ pageIndex: 0, pageSize: 5, previousPageIndex: 0 }),
            },
            tableData: signal([]),
            formStructure: signal([]),
            count: signal(0),
            viewConfig: signal({}),
            routingToDetailPage: signal({ visible: false }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableWithFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
