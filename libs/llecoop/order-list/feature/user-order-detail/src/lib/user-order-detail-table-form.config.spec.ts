import { signal } from '@angular/core';
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

import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  const orderListStoreMock = {
    currentOrderCount: signal(0),
    currentOrderAvailableProducts: signal([]),
  };

  const userOrderStoreMock = {
    orderProductsSorting: signal(['name', 'asc']),
    orderProductsPagination: signal({ pageIndex: 0, pageSize: 10 }),
  };

  let config: LlecoopUserOrderDetailFormTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (val: string) => val } },
        { provide: llecoopOrderListStore, useValue: orderListStoreMock },
        { provide: llecoopUserOrderStore, useValue: userOrderStoreMock },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape unit pipe output in the priceWithIva column formatter to prevent XSS', () => {
    const tableDefinition = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDefinition.columnProperties();
    const priceColumn = columns.find(col => col.key === 'priceWithIva');

    expect(priceColumn).toBeTruthy();
    expect(priceColumn?.formatting?.type).toBe('CUSTOM');

    // Create a product with a malicious base value that will be interpolated in the pipe
    const maliciousProduct = {
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<script>alert(1)</script>' as any,
      },
    } as any as LlecoopOrderProduct;

    const rendered = priceColumn?.formatting?.execute?.('10', maliciousProduct) as string;

    expect(rendered).not.toContain('<script>');
    expect(rendered).toContain('&lt;script&gt;');
  });
});
