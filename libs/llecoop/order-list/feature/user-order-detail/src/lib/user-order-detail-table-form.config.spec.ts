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
        { provide: llecoopOrderListStore, useValue: orderListStore },
        { provide: llecoopUserOrderStore, useValue: userOrderStore },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserOrderDetailFormTableConfig).getTableDefinition()
    );
  });

  it('should sanitize unit text output to prevent XSS injection', () => {
    const columns = definition.columnProperties();
    const priceWithIvaCol = columns.find(col => col.key === 'priceWithIva');
    expect(priceWithIvaCol).toBeDefined();

    const maliciousUnit = {
      type: 'unitWithFixedWeight' as const,
      base: '<img src=x onerror=alert(1)>' as unknown as number,
    };

    const element: Partial<LlecoopOrderProduct> = {
      unit: maliciousUnit,
    };

    const sanitizer = TestBed.inject(DomSanitizer);
    const result = priceWithIvaCol?.formatting.execute?.(10, element as LlecoopOrderProduct);

    const serializedHtml = (result as unknown as { changingThisBreaksApplicationSecurity: string })
      .changingThisBreaksApplicationSecurity;

    expect(serializedHtml).not.toContain('<img');
    expect(serializedHtml).toContain('&lt;img');
  });
});
