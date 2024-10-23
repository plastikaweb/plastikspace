import { signal } from '@angular/core';
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
        provideRouter([]),
        {
          provide: TABLE_WITH_FILTERING_FACADE,
          useValue: {
            tableStructure: signal({}),
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

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
