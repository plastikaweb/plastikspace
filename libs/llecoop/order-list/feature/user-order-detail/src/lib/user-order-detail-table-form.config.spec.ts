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
  const orderListStore = {
    currentOrderCount: signal(0),
    currentOrderAvailableProducts: signal([]),
  };
  const userOrderStore = {
    orderProductsSorting: signal([]),
    orderProductsPagination: signal({}),
  };
  const productBaseUnitTextPipe = {
    transform: vi.fn().mockImplementation(unit => `${unit.base || ''} unit-mock`),
  };
  const productUnitStepPipe = { transform: vi.fn() };
  const productUnitSuffixPipe = { transform: vi.fn() };

  let config: LlecoopUserOrderDetailFormTableConfig;
  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    productBaseUnitTextPipe.transform.mockClear();

    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        { provide: llecoopOrderListStore, useValue: orderListStore },
        { provide: llecoopUserOrderStore, useValue: userOrderStore },
        { provide: LlecoopProductBaseUnitTextPipe, useValue: productBaseUnitTextPipe },
        { provide: LlecoopProductUnitStepPipe, useValue: productUnitStepPipe },
        { provide: LlecoopProductUnitSuffixPipe, useValue: productUnitSuffixPipe },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
    definition = TestBed.runInInjectionContext(() => config.getTableDefinition());
  });

  it('should escape HTML in LlecoopProductBaseUnitTextPipe output to prevent XSS', () => {
    productBaseUnitTextPipe.transform.mockReturnValue('<img src=x onerror=alert(1)>');

    const priceColumn = definition.columnProperties().find(col => col.key === 'priceWithIva');
    expect(priceColumn).toBeTruthy();

    const element = {
      unit: { type: 'unitWithFixedVolume', base: '<script>alert(1)</script>' },
    } as unknown as LlecoopOrderProduct;

    const result = priceColumn?.formatting?.execute?.(10, element) as any;
    const htmlString = result.changingThisBreaksApplicationSecurity;

    expect(htmlString).not.toContain('<img');
    expect(htmlString).toContain('&lt;img');
  });
});
