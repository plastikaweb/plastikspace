import { TestBed } from '@angular/core/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';

import { EcoStoreProductsApiService } from './eco-store-products-api.service';

describe('EcoStoreProductsApiService', () => {
  let service: EcoStoreProductsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideEnvironmentMock()],
    });
    service = TestBed.inject(EcoStoreProductsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
