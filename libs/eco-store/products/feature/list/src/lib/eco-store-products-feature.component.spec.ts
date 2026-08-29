import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { mockEcoStoreCartStore } from '@plastik/eco-store/cart/data-access/testing';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { mockEcoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { axe } from 'vitest-axe';
import EcoStoreProductsFeature from './eco-store-products-feature.component';

describe('EcoStoreProductsFeature', () => {
  let component: EcoStoreProductsFeature;
  let fixture: ComponentFixture<EcoStoreProductsFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProductsFeature],
      providers: [
        provideTranslateService(),
        provideEnvironmentPocketBaseTranslationMock(),
        provideRouter([]),
        {
          provide: POCKETBASE_INSTANCE,
          useValue: mockPocketBase,
        },
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
        {
          provide: ecoStoreCartStore,
          useValue: mockEcoStoreCartStore,
        },
        {
          provide: ecoStoreProductCategoriesStore,
          useValue: mockEcoStoreProductCategoriesStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProductsFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  }, 10000);

  it('should navigate when sort is called', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const sortConfig = { active: 'priceWithIva', direction: 'asc' };

    component.sort(sortConfig as any);

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: { ...sortConfig, page: 0 },
      queryParamsHandling: 'merge',
    });
  });
});
