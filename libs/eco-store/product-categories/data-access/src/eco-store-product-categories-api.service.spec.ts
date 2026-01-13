import { signal } from '@angular/core';
import { EcoStoreTenantBaseService } from '@plastik/eco-store/tenant';

import { TestBed } from '@angular/core/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments';
import { EcoStoreProductCategoriesApiService } from './eco-store-product-categories-api.service';

// ... existing imports

describe('EcoStoreProductCategoriesApiService', () => {
  let service: EcoStoreProductCategoriesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideEnvironmentPocketBaseTranslationMock(),
        {
          provide: EcoStoreTenantBaseService,
          useValue: {
            tenant: signal(null),
          },
        },
      ],
    });
    service = TestBed.inject(EcoStoreProductCategoriesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
