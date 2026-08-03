import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  const mockOrderListStore = {
    currentOrderCount: signal(0),
    currentOrderAvailableProducts: signal([]),
  };
  const mockUserOrderStore = {
    orderProductsSorting: signal({ active: 'name', direction: 'asc' }),
    orderProductsPagination: signal({ pageIndex: 0, pageSize: 10 }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        { provide: llecoopOrderListStore, useValue: mockOrderListStore },
        { provide: llecoopUserOrderStore, useValue: mockUserOrderStore },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val as unknown as SafeHtml,
          },
        },
      ],
    });
  });

  it('should escape HTML/XSS payloads in the dynamic unit base text', () => {
    const config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columnProperties = tableDef.columnProperties();

    const priceWithIvaColumn = columnProperties.find(col => col.key === 'priceWithIva');
    expect(priceWithIvaColumn).toBeTruthy();
    expect(priceWithIvaColumn?.formatting.type).toBe('CUSTOM');

    const maliciousProduct: LlecoopOrderProduct = {
      id: 'p1',
      name: 'Test Product',
      normalizedName: 'test product',
      price: 10,
      priceWithIva: 10,
      initQuantity: 1,
      initPrice: 10,
      finalQuantity: 1,
      finalPrice: 10,
      category: 'c1',
      iva: 10,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<script>alert("XSS")</script>',
      },
    };

    const formattedOutput = priceWithIvaColumn?.formatting.execute?.('10.00', maliciousProduct) as string;
    expect(formattedOutput).not.toContain('<script>');
    expect(formattedOutput).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
  });
});
