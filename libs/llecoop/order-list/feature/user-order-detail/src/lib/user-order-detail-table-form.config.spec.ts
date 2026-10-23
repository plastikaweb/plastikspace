import { provideZonelessChangeDetection } from '@angular/core';
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
  let config: LlecoopUserOrderDetailFormTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (value: string) => value as unknown as SafeHtml,
          },
        },
        {
          provide: llecoopOrderListStore,
          useValue: {
            currentOrderCount: () => 0,
            currentOrderAvailableProducts: () => [],
          },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            orderProductsSorting: () => null,
            orderProductsPagination: () => null,
          },
        },
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {},
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape malicious HTML in base unit text in priceWithIva column execute()', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties();
    const priceColumn = columns.find(col => col.key === 'priceWithIva');

    expect(priceColumn).toBeTruthy();

    const mockProduct = {
      name: 'Test Product',
      priceWithIva: 12.5,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<script>alert("xss")</script>',
      },
    } as unknown as LlecoopOrderProduct;

    const result = priceColumn?.formatting.execute?.(12.5, mockProduct) as string;

    expect(result).not.toContain('<script>alert("xss")</script>');
    expect(result).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });
});
