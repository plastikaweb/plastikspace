/* eslint-disable no-console */
import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEventConfig, TableSorting } from '@plastik/shared/table/entities';

import { LlecoopOrderListFeatureListFacadeService } from '../order-list-feature-list-facade.service';
import { LlecoopOrderListFeatureListComponent } from './llecoop-order-list-feature-list.component';

describe('LlecoopOrderListFeatureListComponent', () => {
  let component: LlecoopOrderListFeatureListComponent;
  let fixture: ComponentFixture<LlecoopOrderListFeatureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopOrderListFeatureListComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: LlecoopOrderListFeatureListFacadeService,
          useValue: {
            viewConfig: signal({
              icon: 'list',
              title: 'Llistat de comandes',
            }),
            routingToDetailPage: signal({
              visible: false,
            }),
            viewExtraActions: signal([]),
            tableDefinition: {
              columnProperties: signal([]),
              count: signal(0),
              getData: () => [],
              pagination: signal({
                pageIndex: 0,
                pageSize: 5,
                previousPageIndex: 0,
              }),
              tableFilterPredicate: () => true,
            },
            filterFormConfig: [],
            filterCriteria: signal({}),
            onChangeFilterCriteria: (criteria: Record<string, string>) => console.log(criteria),
            onTableSorting: (sorting: TableSorting) => console.log(sorting),
            onTablePagination: (pageEventConfig: PageEventConfig) => console.log(pageEventConfig),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopOrderListFeatureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
