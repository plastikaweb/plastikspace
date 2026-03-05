import { TestBed } from '@angular/core/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { EcoStoreProductCategoriesApiService } from './eco-store-product-categories-api.service';

describe('EcoStoreProductCategoriesApiService', () => {
  let service: EcoStoreProductCategoriesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideEnvironmentPocketBaseTranslationMock(),
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
      ],
    });
    service = TestBed.inject(EcoStoreProductCategoriesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
