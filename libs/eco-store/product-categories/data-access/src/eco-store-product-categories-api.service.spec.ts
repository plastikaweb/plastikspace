import { TestBed } from '@angular/core/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { EcoStoreProductCategoriesApiService } from './eco-store-product-categories-api.service';

describe('EcoStoreProductCategoriesApiService', () => {
  let service: EcoStoreProductCategoriesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideEnvironmentMock()],
    });
    service = TestBed.inject(EcoStoreProductCategoriesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
