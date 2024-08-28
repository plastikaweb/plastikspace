import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TABLE_WITH_FILTERING_TOKEN } from './table-with-filtering-facade.type';
import { TableWithFilteringComponent } from './table-with-filtering.component';

describe('TableWithFilteringComponent', () => {
  let component: TableWithFilteringComponent;
  let fixture: ComponentFixture<TableWithFilteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWithFilteringComponent],
      providers: [
        {
          provide: TABLE_WITH_FILTERING_TOKEN,
          useValue: {
            tableStructure: signal({}),
            tableData: signal([]),
            count: signal(0),
            viewName: 'viewName',
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
