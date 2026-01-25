import { TestBed } from '@angular/core/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { ecoStoreTenantStoreMock } from '@plastik/eco-store/tenant/testing';

import { EcoStoreProductsApiService } from './eco-store-products-api.service';

describe('EcoStoreProductsApiService', () => {
  let service: EcoStoreProductsApiService;

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
    service = TestBed.inject(EcoStoreProductsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
