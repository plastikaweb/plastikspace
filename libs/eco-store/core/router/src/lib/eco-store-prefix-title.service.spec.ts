import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';
import {
  POCKETBASE_ENVIRONMENT,
  POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
} from '@plastik/core/environments';
import { provideEnvironmentMock } from '@plastik/core/environments/testing';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { mockEcoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access/testing';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { mockEcoStoreProductsStore } from '@plastik/eco-store/products/data-access/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';

import { EcoStorePrefixTitleService } from './eco-store-prefix-title.service';

describe('EcoStorePrefixTitleService', () => {
  let service: EcoStorePrefixTitleService;
  let routerStateSnapshot: RouterStateSnapshot;
  let titleService: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideEnvironmentMock(),
        { provide: POCKETBASE_ENVIRONMENT, useValue: { baseUrl: 'http://localhost' } },
        { provide: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT, useValue: { defaultLanguage: 'ca' } },
        EcoStorePrefixTitleService,
        Title,
        {
          provide: RouterStateSnapshot,
          useValue: {
            toString: vi.fn(),
          },
        },
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
        {
          provide: ecoStoreProductCategoriesStore,
          useValue: mockEcoStoreProductCategoriesStore,
        },
        {
          provide: ecoStoreProductsStore,
          useValue: mockEcoStoreProductsStore,
        },
      ],
    });
    service = TestBed.inject(EcoStorePrefixTitleService);
    routerStateSnapshot = TestBed.inject(RouterStateSnapshot);
    titleService = TestBed.inject(Title);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a route title based on tenant name and route snapshot title', async () => {
    vi.spyOn(service, 'buildTitle').mockImplementation(() => 'section');
    service.updateTitle(routerStateSnapshot);
    TestBed.flushEffects();
    expect(titleService.getTitle()).toBe(`tenant - section`);
  });

  it('should return a route title based on category name when CATEGORY_TITLE key is used', async () => {
    vi.spyOn(service, 'buildTitle').mockImplementation(() => 'CATEGORY_TITLE:envasats');
    service.updateTitle(routerStateSnapshot);
    TestBed.flushEffects();
    expect(titleService.getTitle()).toBe(`tenant - Envasats`);
  });

  it('should return a route title based on product name when PRODUCT_TITLE key is used', async () => {
    vi.spyOn(service, 'buildTitle').mockImplementation(() => 'PRODUCT_TITLE:product-slug');
    service.updateTitle(routerStateSnapshot);
    TestBed.flushEffects();
    expect(titleService.getTitle()).toBe(`tenant - Producte`);
  });

  it('should return only tenant name if route snapshot title is empty', async () => {
    vi.spyOn(service, 'buildTitle').mockImplementation(() => '');
    service.updateTitle(routerStateSnapshot);
    TestBed.flushEffects();
    expect(titleService.getTitle()).toBe(`tenant`);
  });

  it('should fallback to environment name if tenant name is empty', async () => {
    mockEcoStoreTenantStore.tenant.set(null as any);
    vi.spyOn(service, 'buildTitle').mockImplementation(() => 'section');
    service.updateTitle(routerStateSnapshot);
    TestBed.flushEffects();
    expect(titleService.getTitle()).toBe(`my-app - section`);
  });
});
