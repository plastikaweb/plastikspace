import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableColumnFormattingCustom } from '@plastik/shared/table/entities';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  let service: LlecoopUserOrderDetailFormTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {},
        },
        {
          provide: llecoopOrderListStore,
          useValue: {
            currentOrderCount: vi.fn(),
            currentOrderAvailableProducts: vi.fn(),
          },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            orderProductsSorting: vi.fn(),
            orderProductsPagination: vi.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape malicious HTML in unit base text for priceWithIva formatting', () => {
    const tableDef = TestBed.runInInjectionContext(() => service.getTableDefinition());
    const priceColumn = tableDef.columnProperties()?.find(col => col.key === 'priceWithIva');
    const customFormatting = priceColumn?.formatting as TableColumnFormattingCustom<LlecoopOrderProduct>;

    const productWithXss = {
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert("xss")>',
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = customFormatting.execute(10, productWithXss);
    const resultString = (formatted as { changingThisBreaksApplicationSecurity?: string })
      ?.changingThisBreaksApplicationSecurity || String(formatted);

    expect(resultString).not.toContain('<img src=x onerror=alert("xss")>');
    expect(resultString).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(&quot;xss&quot;)&gt;');
  });
});
