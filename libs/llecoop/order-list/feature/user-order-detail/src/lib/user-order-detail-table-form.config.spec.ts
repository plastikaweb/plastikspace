import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';

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
  let tableDef: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        { provide: llecoopOrderListStore, useValue: orderListStoreMock },
        { provide: llecoopUserOrderStore, useValue: userOrderStoreMock },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
    tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
  });

  it('should escape HTML in the product unit base text to prevent XSS in priceWithIva column', () => {
    const priceColumn = tableDef.columnProperties().find(col => col.key === 'priceWithIva');
    expect(priceColumn).toBeDefined();

    const product = {
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert("XSS")>',
      },
    } as unknown as LlecoopOrderProduct;

    const result = priceColumn?.formatting?.execute?.(10, product) as unknown as {
      changingThisBreaksApplicationSecurity: string;
    };

    const renderedHtml = result.changingThisBreaksApplicationSecurity;
    expect(renderedHtml).not.toContain('<img src=x onerror=alert("XSS")>');
    expect(renderedHtml).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(&quot;XSS&quot;)&gt;');
  });
});
