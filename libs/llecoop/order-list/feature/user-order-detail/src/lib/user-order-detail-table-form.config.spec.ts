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
  let configService: LlecoopUserOrderDetailFormTableConfig;

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
            // eslint-disable-next-line id-denylist
            bypassSecurityTrustHtml: (value: string) => value,
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
            orderProductsSorting: () => ({ active: 'name', direction: 'asc' }),
            orderProductsPagination: () => ({ pageIndex: 0, pageSize: 10 }),
          },
        },
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {
            columnProperties: [],
          },
        },
      ],
    });

    configService = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should be created', () => {
    expect(configService).toBeTruthy();
  });

  it('should return table definition', () => {
    const tableDef = configService.getTableDefinition();

    expect(tableDef).toBeTruthy();
    expect(tableDef.caption).toBe('Llistat de productes');
  });

  it('should sanitize priceWithIva formatting output including unit text', () => {
    const tableDef = configService.getTableDefinition();
    const priceColumn = tableDef.columnProperties().find(col => col.key === 'priceWithIva');

    expect(priceColumn).toBeTruthy();

    const mockProduct: LlecoopOrderProduct = {
      id: '1',
      name: 'Product 1',
      unit: {
        type: 'unitWithFixedWeight',
        base: '<script>alert("xss")</script>' as unknown as number,
      },
    } as LlecoopOrderProduct;

    const formatted = priceColumn?.formatting.execute?.(2.5, mockProduct) as unknown as string;

    expect(formatted).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(formatted).not.toContain('<script>');
  });
});
