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
  let config: LlecoopUserOrderDetailFormTableConfig;
  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        {
          provide: llecoopOrderListStore,
          useValue: {
            currentOrderCount: signal(0),
            currentOrderAvailableProducts: signal([]),
          },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            orderProductsSorting: signal(['name', 'asc']),
            orderProductsPagination: signal({ pageIndex: 0, pageSize: 10 }),
          },
        },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
    definition = TestBed.runInInjectionContext(() => config.getTableDefinition());
  });

  it('should escape HTML in unit.base when formatting priceWithIva column', () => {
    const column = definition.columnProperties().find(col => col.key === 'priceWithIva');
    expect(column).toBeDefined();

    const product = {
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = column?.formatting?.execute?.(10, product) as {
      changingThisBreaksApplicationSecurity?: string;
    };
    const html = formatted?.changingThisBreaksApplicationSecurity || String(formatted);

    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });
});
