import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let config: LlecoopUserOrderResumeTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        {
          provide: llecoopUserOrderStore,
          useValue: { selectedItem: signal(null) },
        },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape HTML in product unit text for name formatting', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const nameCol = tableDef.columnProperties().find(col => col.key === 'name');

    const unsafeProduct = {
      name: 'Product X',
      price: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = nameCol?.formatting?.execute?.('Product X', unsafeProduct) as unknown as string;
    const resultString = String(formatted);

    expect(resultString).not.toContain('<img');
    expect(resultString).toContain('&lt;img');
  });
});
