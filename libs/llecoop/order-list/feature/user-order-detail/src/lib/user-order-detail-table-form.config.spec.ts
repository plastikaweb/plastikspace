import { provideZonelessChangeDetection, signal } from '@angular/core';
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
    orderProductsSorting: signal({ active: 'name', direction: 'asc' }),
    orderProductsPagination: signal({ pageIndex: 0, pageSize: 10 }),
  };

  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
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

  it('should escape HTML in product unit base text in priceWithIva column formatting (SEC-08)', () => {
    const priceWithIvaCol = definition.columnProperties().find(col => col.key === 'priceWithIva');

    expect(priceWithIvaCol).toBeTruthy();

    const productWithMaliciousUnit: LlecoopOrderProduct = {
      id: 'p1',
      name: 'Product 1',
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>',
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = priceWithIvaCol?.formatting?.execute?.(10, productWithMaliciousUnit) as {
      changingThisBreaksApplicationSecurity: string;
    };

    const html = formatted.changingThisBreaksApplicationSecurity;

    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });
});
