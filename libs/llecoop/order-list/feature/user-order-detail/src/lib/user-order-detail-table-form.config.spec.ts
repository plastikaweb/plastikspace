import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  const mockDomSanitizer = {
    bypassSecurityTrustHtml: vi.fn((val: string) => val),
  };

  const mockProductBaseUnitTextPipe = {
    transform: vi.fn((unit: { type: string; base?: string }) => `${unit.base} kg unitat`),
  };

  const mockProductUnitSuffixPipe = {
    transform: vi.fn(() => 'kg'),
  };

  const mockProductUnitStepPipe = {
    transform: vi.fn(() => 1),
  };

  const mockOrderListStore = {
    currentOrderCount: vi.fn(),
    currentOrderAvailableProducts: vi.fn(),
  };

  const mockUserOrderStore = {
    orderProductsSorting: vi.fn(),
    orderProductsPagination: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DomSanitizer, useValue: mockDomSanitizer },
        { provide: LlecoopProductBaseUnitTextPipe, useValue: mockProductBaseUnitTextPipe },
        { provide: LlecoopProductUnitSuffixPipe, useValue: mockProductUnitSuffixPipe },
        { provide: LlecoopProductUnitStepPipe, useValue: mockProductUnitStepPipe },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
        { provide: llecoopOrderListStore, useValue: mockOrderListStore },
        { provide: llecoopUserOrderStore, useValue: mockUserOrderStore },
      ],
    });
  });

  it('should escape malicious HTML in unit text formatting to prevent XSS', () => {
    const config = TestBed.runInInjectionContext(() => new LlecoopUserOrderDetailFormTableConfig());
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());

    const priceWithIvaCol = tableDef.columnProperties().find(col => col.key === 'priceWithIva');
    expect(priceWithIvaCol).toBeDefined();

    const maliciousUnit = {
      type: 'unitWithFixedWeight',
      base: '<img src=x onerror=alert(1)>',
    };

    const element = {
      unit: maliciousUnit as never,
    } as LlecoopOrderProduct;

    const result = priceWithIvaCol?.formatting?.execute?.(10, element) as unknown as string;

    expect(result).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    expect(result).not.toContain('<img src=x onerror=alert(1)>');
  });
});
