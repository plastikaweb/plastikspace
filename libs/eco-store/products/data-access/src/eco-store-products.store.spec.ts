import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { setAllEntities } from '@ngrx/signals/entities';
import { TranslateService } from '@ngx-translate/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { EcoStoreProduct, ProductCategoryStats } from '@plastik/eco-store/entities';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { mockEcoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EcoStoreProductsApiService } from './eco-store-products-api.service';
import { ecoStoreProductsStore } from './eco-store-products.store';

describe('ecoStoreProductsStore', () => {
  const onLangChange = new EventEmitter<{ lang: string }>();

  const mockTranslateService = {
    onLangChange,
    getCurrentLang: vi.fn().mockReturnValue('ca'),
    getFallbackLang: vi.fn().mockReturnValue('ca'),
  };

  const mockProductsApiService = {
    getList: vi.fn().mockReturnValue(of({ items: [], totalItems: 0, totalPages: 1 })),
    getOneBySlug: vi.fn().mockReturnValue(of(null)),
  };

  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        ecoStoreProductsStore,
        { provide: POCKETBASE_INSTANCE, useValue: mockPocketBase },
        { provide: POCKETBASE_ENVIRONMENT, useValue: { production: false, environment: 'test' } },
        { provide: EcoStoreProductsApiService, useValue: mockProductsApiService },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
        { provide: ecoStoreProductCategoriesStore, useValue: mockEcoStoreProductCategoriesStore },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    });

    return { store: TestBed.inject(ecoStoreProductsStore) };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCategoryStats: ProductCategoryStats[] = [
    {
      category: 'cat-1',
      name: { ca: 'Envasats', es: 'Envasados' } as any,
      normalizedName: 'envasats',
      color: '#ff0000',
      icon: 'box',
      count: 10,
    },
  ];

  const mockProduct: EcoStoreProduct = {
    id: 'prod-1',
    name: { ca: "Oli d'Oliva", es: 'Aceite de Oliva' } as any,
    normalizedName: 'oli-d-oliva',
    description: { ca: 'Oli verge', es: 'Aceite virgen' } as any,
    features: [{ ca: 'Ecològic', es: 'Ecológico' }] as any,
    category: 'cat-1',
    price: 10,
    priceWithIva: 12,
    iva: 20,
    unitBase: 1,
    unitType: 'L',
    stock: 50,
    inStock: true,
    images: [],
    minQuantity: 1,
    maxQuantity: 10,
    tenant: 'tenant-1',
    created: new Date(),
    updated: new Date(),
    collectionId: 'col-1',
    collectionName: 'products',
  };

  it('should be created', () => {
    const { store } = setup();
    expect(store).toBeTruthy();
  });

  it('should calculate productsWithTranslatedText, productsBySlugMap, and findProductBySlug correctly', () => {
    mockEcoStoreProductCategoriesStore.stats.set(mockCategoryStats);
    const { store } = setup();

    patchState(store, setAllEntities([mockProduct]));

    const translated = store.productsWithTranslatedText();
    expect(translated.length).toBe(1);
    expect(translated[0].name).toBe("Oli d'Oliva");
    expect(translated[0].categoryName).toBe('Envasats');
    expect(translated[0].categorySlug).toBe('envasats');

    const slugMap = store.productsBySlugMap();
    expect(slugMap.size).toBe(1);
    expect(slugMap.has('oli-d-oliva')).toBe(true);

    const findFn = store.findProductBySlug();
    const foundProduct = findFn('oli-d-oliva');
    expect(foundProduct).toBeDefined();
    expect(foundProduct?.id).toBe('prod-1');
    expect(foundProduct?.name).toBe("Oli d'Oliva");
    expect(foundProduct?.categoryName).toBe('Envasats');

    expect(findFn(null)).toBeUndefined();
    expect(findFn('non-existent')).toBeUndefined();
  });

  it('should set selected product from slug via setSelectedFromSlug', () => {
    mockEcoStoreProductCategoriesStore.stats.set(mockCategoryStats);
    const { store } = setup();

    patchState(store, setAllEntities([mockProduct]));

    const result = store.setSelectedFromSlug('oli-d-oliva');
    expect(result).toBe(true);
    expect(store.selectedItemId()).toBe('prod-1');

    const notFoundResult = store.setSelectedFromSlug('non-existent');
    expect(notFoundResult).toBe(false);
  });
});
