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
        { provide: llecoopOrderListStore, useValue: orderListStore },
        { provide: llecoopUserOrderStore, useValue: userOrderStore },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserOrderDetailFormTableConfig).getTableDefinition()
    );
  });

  it('should escape HTML in unit text to prevent XSS vulnerability', () => {
    const priceColumn = definition.columnProperties().find(col => col.key === 'priceWithIva');
    expect(priceColumn).toBeDefined();

    const mockProduct = {
      name: 'Test Product',
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    } as unknown as LlecoopOrderProduct;

    const result = priceColumn?.formatting?.execute?.(10, mockProduct) as {
      changingThisBreaksApplicationSecurity: string;
    };
    const htmlOutput = result.changingThisBreaksApplicationSecurity;

    expect(htmlOutput).not.toContain('<img');
    expect(htmlOutput).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
  });
});
