import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { OrderListUserOrderResumeTableConfig } from './order-list-user-order-resume-table.config';

describe('OrderListUserOrderResumeTableConfig', () => {
  const mockOrderListStore = {
    sorting: signal({ active: 'name', direction: 'asc' }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderListUserOrderResumeTableConfig,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        { provide: llecoopOrderListStore, useValue: mockOrderListStore },
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

  it('should escape HTML/XSS payloads in element name and info properties inside name column formatting', () => {
    const config = TestBed.inject(OrderListUserOrderResumeTableConfig);
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columnProperties = tableDef.columnProperties();

    const nameColumn = columnProperties.find(col => col.key === 'name');
    expect(nameColumn).toBeTruthy();
    expect(nameColumn?.formatting.type).toBe('CUSTOM');

    const maliciousProduct: LlecoopOrderProduct = {
      id: 'p1',
      name: '<script>alert("XSS")</script>',
      normalizedName: 'test product',
      price: 10,
      priceWithIva: 10,
      initQuantity: 1,
      initPrice: 10,
      finalQuantity: 1,
      finalPrice: 10,
      category: 'c1',
      iva: 10,
      info: '<img src=x onerror=alert(1)>',
      unit: {
        type: 'unit',
      },
    };

    const formattedOutput = nameColumn?.formatting.execute?.('', maliciousProduct) as string;
    expect(formattedOutput).not.toContain('<script>');
    expect(formattedOutput).not.toContain('<img');
    expect(formattedOutput).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    expect(formattedOutput).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
  });
});
