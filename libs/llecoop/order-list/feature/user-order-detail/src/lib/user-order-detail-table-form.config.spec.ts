import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopOrderListStore, llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  let config: LlecoopUserOrderDetailFormTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        {
          provide: llecoopOrderListStore,
          useValue: { currentOrderCount: signal(0), currentOrderAvailableProducts: signal([]) },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: { orderProductsSorting: signal([]), orderProductsPagination: signal({}) },
        },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape HTML in product unit text for priceWithIva formatting', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const priceCol = tableDef.columnProperties().find(col => col.key === 'priceWithIva');

    const unsafeProduct = {
      priceWithIva: 5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = priceCol?.formatting?.execute?.(5, unsafeProduct) as unknown as string;
    const resultString = String(formatted);

    expect(resultString).not.toContain('<img');
    expect(resultString).toContain('&lt;img');
  });
});
