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
import { describe, expect, it, beforeEach } from 'vitest';
import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  let config: LlecoopUserOrderDetailFormTableConfig;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitStepPipe,
        LlecoopProductUnitSuffixPipe,
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {
            columnProperties: [],
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
            orderProductsSorting: () => ({}),
            orderProductsPagination: () => ({}),
          },
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should escape malicious script payload in unit.base for priceWithIva column', () => {
    const tableDef = TestBed.runInInjectionContext(() =>
      config.getTableDefinition()
    );
    const columns = tableDef.columnProperties();
    const priceWithIvaCol = columns.find(col => col.key === 'priceWithIva');

    expect(priceWithIvaCol).toBeDefined();

    const mockProduct = {
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>',
      },
    } as unknown as LlecoopOrderProduct;

    if (priceWithIvaCol?.formatting?.type === 'CUSTOM') {
      const result = priceWithIvaCol.formatting.execute(
        mockProduct.priceWithIva,
        mockProduct
      );
      const sanitizedHtml = sanitizer.sanitize(1, result) ?? String(result);

      expect(sanitizedHtml).not.toContain('<img src=x onerror=alert(1)>');
      expect(sanitizedHtml).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    }
  });
});
