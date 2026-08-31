import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct, LlecoopProductUnit } from '@plastik/llecoop/entities';
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
        {
          provide: DomSanitizer,
          useValue: { bypassSecurityTrustHtml: (value: string) => value },
        },
        { provide: llecoopOrderListStore, useValue: orderListStoreMock },
        { provide: llecoopUserOrderStore, useValue: userOrderStoreMock },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserOrderDetailFormTableConfig).getTableDefinition()
    );
  });

  it('should escape HTML in product base unit text for priceWithIva formatting', () => {
    const priceColumn = definition.columnProperties().find(col => col.key === 'priceWithIva');
    expect(priceColumn).toBeDefined();

    const maliciousUnit: LlecoopProductUnit = {
      type: 'unitWithFixedVolume',
      base: '<img src=x onerror=alert(1)>' as unknown as number,
    };

    const product = {
      unit: maliciousUnit,
    } as LlecoopOrderProduct;

    const formatted = priceColumn?.formatting?.execute?.(2.5, product) as string;

    expect(formatted).not.toContain('<img');
    expect(formatted).toContain('&lt;img');
    expect(formatted).toContain('onerror&#x3D;alert(1)');
  });
});
