import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LlecoopOrderListFeatureDetailFacadeService } from '../order-list-feature-detail-facade.service';
import { LlecoopOrderListFeatureDetailComponent } from './llecoop-order-list-feature-detail.component';

describe('LlecoopOrderListFeatureDetailComponent', () => {
  let component: LlecoopOrderListFeatureDetailComponent;
  let fixture: ComponentFixture<LlecoopOrderListFeatureDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopOrderListFeatureDetailComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: LlecoopOrderListFeatureDetailFacadeService,
          useValue: {
            viewConfig: signal({
              title: 'title',
              icon: 'icon',
            }),
            routingToDetailPage: signal({
              visible: true,
            }),
            tableDefinition: {
              columnProperties: [],
              getData: () => [],
              sort: signal({}),
              caption: '',
              count: signal(0),
              actions: {},
              noPagination: false,
            },
            filterCriteria: signal({}),
            tableFilterPredicate: () => false,
            // eslint-disable-next-line no-console
            onChangeFilterCriteria: (criteria: Record<string, string>) => console.log(criteria),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopOrderListFeatureDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
