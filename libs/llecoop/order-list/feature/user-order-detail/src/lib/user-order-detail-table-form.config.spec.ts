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
        LlecoopUserOrderDetailFormTableConfig,
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

  it('should escape HTML in unit text when formatting priceWithIva column', () => {
    const columns = definition.columnProperties();
    const priceCol = columns.find(column => column.key === 'priceWithIva');

    expect(priceCol).toBeDefined();

    const mockProduct = {
      id: 'p1',
      priceWithIva: 5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert("xss")>' as unknown as number,
      },
    } as unknown as LlecoopOrderProduct;

    const result = priceCol?.formatting?.execute?.(5, mockProduct) as {
      changingThisBreaksApplicationSecurity?: string;
    };
    const htmlString = result?.changingThisBreaksApplicationSecurity || String(result);

    expect(htmlString).not.toContain('<img');
    expect(htmlString).toContain('&lt;img');
  });
});
