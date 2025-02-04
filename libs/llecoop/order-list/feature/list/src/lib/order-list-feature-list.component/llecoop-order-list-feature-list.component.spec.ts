import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

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
              columnProperties: [],
              count: signal(0),
              getData: () => [],
              filterCriteria: signal({}),
              tableFilterPredicate: () => true,
            },
            filterFormConfig: [],
            filterCriteria: signal({}),
            // eslint-disable-next-line no-console
            onChangeFilterCriteria: (criteria: Record<string, string>) => console.log(criteria),
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
