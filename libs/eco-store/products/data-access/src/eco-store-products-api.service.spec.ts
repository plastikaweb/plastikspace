import { TestBed } from '@angular/core/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { firstValueFrom, of } from 'rxjs';

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
      getFullList: vi.fn().mockReturnValue(of([])),
      getList: vi.fn().mockReturnValue(of({ items: [], totalItems: 0 })),
      getOne: vi.fn().mockReturnValue(of(null)),
    };

    // Spy on the protected method createPocketCrudService
    vi.spyOn(service as any, 'createPocketCrudService').mockReturnValue(mockCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use getList with limit 1 instead of getFullList for performance when getting one by slug', async () => {
    const slug = 'test-slug';

    await firstValueFrom(service.getOneBySlug(slug));

    expect(mockCrudService.getFullList).not.toHaveBeenCalled();
    expect(mockCrudService.getList).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        perPage: 1,
        filter: expect.stringContaining(`normalizedName ="${slug}"`),
        requestKey: 'product_by_slug',
      })
    );
  });
});
