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
  const orderListStore = {
    currentOrderCount: signal(0),
    currentOrderAvailableProducts: signal([]),
  };
  const userOrderStore = {
    orderProductsSorting: signal(['name', 'asc']),
    orderProductsPagination: signal({ pageIndex: 0, pageSize: 10 }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        { provide: llecoopOrderListStore, useValue: orderListStore },
        { provide: llecoopUserOrderStore, useValue: userOrderStore },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (value: string) => value as unknown as SafeHtml,
          },
        },
      ],
    });
  });

  it('should escape HTML in product unit when formatting priceWithIva column', () => {
    const config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties();
    const priceWithIvaCol = columns.find(col => col.key === 'priceWithIva');

    expect(priceWithIvaCol).toBeDefined();

    const productWithXssUnit = {
      priceWithIva: 5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>',
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = priceWithIvaCol?.formatting?.execute?.(5, productWithXssUnit) as string;

    expect(formatted).not.toContain('<img');
    expect(formatted).toContain('&lt;img');
  });
});
