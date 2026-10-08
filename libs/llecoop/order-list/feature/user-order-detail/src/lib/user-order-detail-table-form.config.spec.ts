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
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val,
          },
        },
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
  });

  it('should escape HTML in product unit string rendered in priceWithIva formatting', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columnProps = tableDef.columnProperties();
    const priceColumn = columnProps.find(col => col.key === 'priceWithIva');

    const mockProduct = {
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>',
      } as unknown as LlecoopProductUnit,
    } as LlecoopOrderProduct;

    const result = priceColumn?.formatting?.execute?.(10, mockProduct) as unknown as string;

    expect(result).not.toContain('<img');
    expect(result).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
  });
});
