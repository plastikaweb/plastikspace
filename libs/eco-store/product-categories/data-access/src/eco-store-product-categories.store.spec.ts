import { EventEmitter } from '@angular/core';
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
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EcoStoreProductCategoriesStatsService } from './eco-store-product-categories-stats.service';
import { ecoStoreProductCategoriesStore } from './eco-store-product-categories.store';

describe('ecoStoreProductCategoriesStore', () => {
  const mockTranslateService = {
    onLangChange: new EventEmitter<{ lang: string }>(),
    getCurrentLang: () => 'ca',
    getFallbackLang: () => 'ca',
    instant: (key: string) => key,
  };

  const mockNotificationStore = {
    show: vi.fn(),
  };

  const mockStatsService = {
    getFullList: vi.fn(),
  };

  const setup = () => {
    TestBed.configureTestingModule({
      providers: [
        provideEnvironmentPocketBaseTranslationMock(),
        ecoStoreProductCategoriesStore,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: notificationStore, useValue: mockNotificationStore },
        { provide: EcoStoreProductCategoriesStatsService, useValue: mockStatsService },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
        { provide: ALL_PRODUCTS_ICON, useValue: 'grid_view' },
      ],
    });

    return { store: TestBed.inject(ecoStoreProductCategoriesStore) };
  };

  const mockCategories: ProductCategoryStats[] = [
    {
      category: 'cat-1',
      normalizedName: 'fruit-and-veg',
      name: { ca: 'Fruita i Verdura', es: 'Fruta y Verdura' },
      groupName: { ca: 'Frescos', es: 'Frescos' },
      totalProducts: 15,
      icon: 'apple',
      color: 'green',
    },
    {
      category: 'cat-2',
      normalizedName: 'beverages',
      name: { ca: 'Begudes', es: 'Bebidas' },
      groupName: { ca: 'Celler', es: 'Bodega' },
      totalProducts: 8,
      icon: 'wine_bar',
      color: 'red',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be created and initialized with empty state', () => {
    const { store } = setup();

    expect(store).toBeTruthy();
    expect(store.entities()).toEqual([]);
    expect(store.categoriesBySlugMap().size).toBe(0);
  });

  it('should populate categoriesBySlugMap for O(1) slug lookups when entities change', () => {
    const { store } = setup();

    updateState(
      store,
      '[test] populate',
      setAllEntities(mockCategories, {
        selectId: (entity: ProductCategoryStats) => entity.category,
      })
    );

    expect(store.categoriesBySlugMap().size).toBe(2);
    expect(store.categoriesBySlugMap().get('fruit-and-veg')).toEqual(mockCategories[0]);
    expect(store.categoriesBySlugMap().get('beverages')).toEqual(mockCategories[1]);
  });

  it('should find category by slug via findCategoryBySlug', () => {
    const { store } = setup();

    updateState(
      store,
      '[test] populate',
      setAllEntities(mockCategories, {
        selectId: (entity: ProductCategoryStats) => entity.category,
      })
    );

    expect(store.findCategoryBySlug('fruit-and-veg')).toEqual(mockCategories[0]);
    expect(store.findCategoryBySlug('beverages')).toEqual(mockCategories[1]);
    expect(store.findCategoryBySlug('non-existent')).toBeUndefined();
    expect(store.findCategoryBySlug(null)).toBeUndefined();
  });

  it('should return category icon and translated name via getCategoryBySlug', () => {
    const { store } = setup();

    updateState(
      store,
      '[test] populate',
      setAllEntities(mockCategories, {
        selectId: (entity: ProductCategoryStats) => entity.category,
      })
    );

    const result = store.getCategoryBySlug('fruit-and-veg', 'products.all');

    expect(result).toEqual({
      name: 'Fruita i Verdura',
      icon: 'apple',
    });
  });

  it('should return default fallback icon and text when slug is missing or not found', () => {
    const { store } = setup();

    const fallback = store.getCategoryBySlug(null, 'products.all');

    expect(fallback).toEqual({
      name: 'products.all',
      icon: 'grid_view',
    });
  });

  it('should compute groupedCategories and totalProducts correctly', () => {
    const { store } = setup();

    updateState(
      store,
      '[test] populate',
      setAllEntities(mockCategories, {
        selectId: (entity: ProductCategoryStats) => entity.category,
      })
    );

    expect(store.totalProducts()).toBe(23);
    const groups = store.groupedCategories();

    expect(groups.length).toBe(2);
    expect(groups[0].group.id).toBe('Frescos');
    expect(groups[0].categories[0].productCount).toBe(15);
  });
});
