import { provideZonelessChangeDetection } from '@angular/core';
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
  let service: LlecoopUserOrderDetailFormTableConfig;

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

    service = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape malicious unit base text in priceWithIva column formatting', () => {
    const tableDef = service.getTableDefinition();
    const columnProps = tableDef.columnProperties();
    const priceColumn = columnProps.find(col => col.key === 'priceWithIva');

    const product: Partial<LlecoopOrderProduct> = {
      priceWithIva: 10.5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    };

    const formattedHtml = priceColumn?.formatting?.execute?.(10.5, product as LlecoopOrderProduct) as string;

    expect(formattedHtml).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    expect(formattedHtml).not.toContain('<img src=x onerror=alert(1)>');
  });
});
