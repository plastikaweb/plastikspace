import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import EcoStoreProductsFeature from './eco-store-products-feature.component';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { axe, toHaveNoViolations } from 'jest-axe';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';

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
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  }, 10000);
});
