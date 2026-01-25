import { TestBed } from '@angular/core/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { ecoStoreTenantStoreMock } from '@plastik/eco-store/tenant/testing';
import { EcoStoreProductCategoriesApiService } from './eco-store-product-categories-api.service';

// ... existing imports

describe('EcoStoreProductCategoriesApiService', () => {
  let service: EcoStoreProductCategoriesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideEnvironmentPocketBaseTranslationMock(),
        {
          provide: ecoStoreTenantStore,
          useValue: ecoStoreTenantStoreMock,
        },
      ],
    });
    service = TestBed.inject(EcoStoreProductCategoriesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
