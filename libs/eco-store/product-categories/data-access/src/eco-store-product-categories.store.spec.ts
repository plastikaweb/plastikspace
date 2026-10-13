import { TestBed } from '@angular/core/testing';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { setAllEntities } from '@ngrx/signals/entities';
import { TranslateService } from '@ngx-translate/core';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { ProductCategoryStats } from '@plastik/eco-store/entities';
import { ALL_PRODUCTS_ICON } from '@plastik/eco-store/shared/tokens';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EcoStoreProductCategoriesStatsService } from './eco-store-product-categories-stats.service';
import { ecoStoreProductCategoriesStore } from './eco-store-product-categories.store';

describe('ecoStoreProductCategoriesStore', () => {
  const onLangChange$ = new Subject<{ lang: string }>();

  const mockTranslateService = {
    onLangChange: onLangChange$,
    getCurrentLang: vi.fn().mockReturnValue('ca'),
    getFallbackLang: vi.fn().mockReturnValue('ca'),
    instant: vi.fn().mockImplementation((key: string) => key),
  };

  const mockStatsService = {
    getFullList: vi.fn(),
  };

  const mockNotificationStore = {
    show: vi.fn(),
  };

  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        provideEnvironmentPocketBaseTranslationMock(),
        ecoStoreProductCategoriesStore,
        { provide: EcoStoreProductCategoriesStatsService, useValue: mockStatsService },
        { provide: notificationStore, useValue: mockNotificationStore },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
        { provide: ALL_PRODUCTS_ICON, useValue: 'grid_view' },
      ],
    });

    return { store: TestBed.inject(ecoStoreProductCategoriesStore) };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCategoryStats: ProductCategoryStats[] = [
    {
      category: 'cat-1',
      groupName: { ca: 'Fruites i Verdura', es: 'Frutas y Verduras' },
      name: { ca: 'Fruita', es: 'Fruta' },
      totalProducts: 10,
      normalizedName: 'fruita',
      color: '#ff0000',
      icon: 'apple',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    },
    {
      category: 'cat-2',
      groupName: { ca: 'Fruites i Verdura', es: 'Frutas y Verduras' },
      name: { ca: 'Verdura', es: 'Verdura' },
      totalProducts: 15,
      normalizedName: 'verdura',
      color: '#00ff00',
      icon: 'carrot',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    },
  ];

  it('should be created with initial state', () => {
    const { store } = setup();

    expect(store).toBeTruthy();
    expect(store.entities()).toEqual([]);
    expect(store.loaded()).toBe(false);
    expect(store.isLoading()).toBe(false);
  });

  it('should build categoriesBySlugMap computed signal for O(1) lookups', () => {
    const { store } = setup();

    updateState(
      store,
      '[test] populate categories',
      setAllEntities(mockCategoryStats, {
        selectId: (entity: ProductCategoryStats) => entity.category,
      })
    );

    const map = store.categoriesBySlugMap();

    expect(map.size).toBe(2);
    expect(map.get('fruita')).toEqual(mockCategoryStats[0]);
    expect(map.get('verdura')).toEqual(mockCategoryStats[1]);
  });

  it('should find category by slug using O(1) map lookup', () => {
    const { store } = setup();

    updateState(
      store,
      '[test] populate categories',
      setAllEntities(mockCategoryStats, {
        selectId: (entity: ProductCategoryStats) => entity.category,
      })
    );

    expect(store.findCategoryBySlug('fruita')).toEqual(mockCategoryStats[0]);
    expect(store.findCategoryBySlug('verdura')).toEqual(mockCategoryStats[1]);
    expect(store.findCategoryBySlug('non-existent')).toBeUndefined();
    expect(store.findCategoryBySlug(null)).toBeUndefined();
  });

  it('should get category localization and icon by slug', () => {
    const { store } = setup();

    updateState(
      store,
      '[test] populate categories',
      setAllEntities(mockCategoryStats, {
        selectId: (entity: ProductCategoryStats) => entity.category,
      })
    );

    const categoryData = store.getCategoryBySlug('fruita', 'products.all');

    expect(categoryData).toEqual({
      name: 'Fruita',
      icon: 'apple',
    });

    const defaultData = store.getCategoryBySlug(null, 'products.all');

    expect(defaultData).toEqual({
      name: 'products.all',
      icon: 'grid_view',
    });
  });

  it('should compute groupedCategories and totalProducts correctly', () => {
    const { store } = setup();

    updateState(
      store,
      '[test] populate categories',
      setAllEntities(mockCategoryStats, {
        selectId: (entity: ProductCategoryStats) => entity.category,
      })
    );

    expect(store.totalProducts()).toBe(25);

    const groups = store.groupedCategories();

    expect(groups.length).toBe(1);
    expect(groups[0].categories.length).toBe(2);
    expect(groups[0].categories[0].productCount).toBe(10);
  });
});
