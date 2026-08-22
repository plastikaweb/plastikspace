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

  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        { provide: llecoopOrderListStore, useValue: orderListStoreMock },
        { provide: llecoopUserOrderStore, useValue: userOrderStoreMock },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserOrderDetailFormTableConfig).getTableDefinition()
    );
  });

  it('should escape HTML in unit base text in priceWithIva formatting (SEC-08)', () => {
    const columns = definition.columnProperties();
    const priceColumn = columns.find(col => col.key === 'priceWithIva');

    const result = priceColumn?.formatting?.execute?.(10.5, {
      unit: { type: 'unitWithFixedWeight', base: '<img src=x onerror=alert(1)>' },
    } as unknown as LlecoopOrderProduct) as unknown as {
      changingThisBreaksApplicationSecurity?: string;
    };

    const html = result?.changingThisBreaksApplicationSecurity ?? String(result);
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });
});
