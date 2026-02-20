import { TestBed } from '@angular/core/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { of } from 'rxjs';

import { EcoStoreProductsApiService } from './eco-store-products-api.service';

describe('EcoStoreProductsApiService', () => {
  let service: EcoStoreProductsApiService;
  let mockCrudService: any;

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
    service = TestBed.inject(EcoStoreProductsApiService);

    mockCrudService = {
      getFullList: jest.fn().mockReturnValue(of([])),
      getList: jest.fn().mockReturnValue(of({ items: [], totalItems: 0 })),
      getOne: jest.fn().mockReturnValue(of(null)),
    };

    // Spy on the protected method createPocketCrudService
    jest.spyOn(service as any, 'createPocketCrudService').mockReturnValue(mockCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use getList with limit 1 instead of getFullList for performance when getting one by slug', (done) => {
    const slug = 'test-slug';
    service.getOneBySlug(slug).subscribe(() => {
      // Expect getFullList NOT to be called
      expect(mockCrudService.getFullList).not.toHaveBeenCalled();

      // Expect getList to be called with correct params
      expect(mockCrudService.getList).toHaveBeenCalledWith(expect.objectContaining({
        page: 1,
        perPage: 1,
        filter: expect.stringContaining(`normalizedName = "${slug}"`),
        requestKey: 'product_by_slug',
      }));
      done();
    });
  });
});
