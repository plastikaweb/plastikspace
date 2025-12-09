import { TestBed } from '@angular/core/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments';

import { EcoStoreProductsApiService } from './eco-store-products-api.service';

describe('EcoStoreProductsApiService', () => {
  let service: EcoStoreProductsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideEnvironmentPocketBaseTranslationMock()],
    });
    service = TestBed.inject(EcoStoreProductsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
