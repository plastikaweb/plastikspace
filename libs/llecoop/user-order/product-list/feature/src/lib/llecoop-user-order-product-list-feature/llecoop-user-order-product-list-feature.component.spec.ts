import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlecoopUserOrderProductListFeatureFacadeService } from '../llecoop-user-order-product-list-feature-facade.service';
import { LlecoopUserOrderProductListFeatureComponent } from './llecoop-user-order-product-list-feature.component';

describe('LlecoopUserOrderProductListFeatureComponent', () => {
  let component: LlecoopUserOrderProductListFeatureComponent;
  let fixture: ComponentFixture<LlecoopUserOrderProductListFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: LlecoopUserOrderProductListFeatureFacadeService,
          useValue: {
            facade: {
              pagination: signal({ pageIndex: 0, pageSize: 5, previousPageIndex: 0 }),
              products: signal([]),
              count: signal(0),
              filterCriteria: signal({}),
              filterFormConfig: signal([]),
            },
          },
        },
      ],
      imports: [LlecoopUserOrderProductListFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopUserOrderProductListFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
