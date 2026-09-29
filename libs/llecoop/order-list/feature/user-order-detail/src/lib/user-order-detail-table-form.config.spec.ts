import { EnvironmentInjector, provideZonelessChangeDetection } from '@angular/core';
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
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  let config: LlecoopUserOrderDetailFormTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
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
            currentOrderCount: () => 0,
            currentOrderAvailableProducts: () => [],
          },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            orderProductsSorting: () => ({ active: '', direction: '' }),
            orderProductsPagination: () => ({ pageIndex: 0, pageSize: 10 }),
          },
        },
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {},
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape malicious HTML in product unit text', () => {
    const envInjector = TestBed.inject(EnvironmentInjector);
    const tableDef = envInjector.runInContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties();
    const priceColumn = columns.find(col => col.key === 'priceWithIva');

    const mockProduct: Partial<LlecoopOrderProduct> = {
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    };

    const formatted = priceColumn?.formatting?.execute?.(
      10,
      mockProduct as LlecoopOrderProduct
    ) as string;

    expect(formatted).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    expect(formatted).not.toContain('<img src=x onerror=alert(1)>');
  });
});
