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
  let config: LlecoopUserOrderDetailFormTableConfig;
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
    definition = TestBed.runInInjectionContext(() => config.getTableDefinition());
  });

  it('should escape HTML in product base unit text for priceWithIva column', () => {
    const columns = definition.columnProperties();
    const priceColumn = columns.find(col => col.key === 'priceWithIva');

    const maliciousUnit = {
      type: 'unitWithFixedWeight',
      base: '<img src=x onerror=alert(1)>' as unknown as number,
    } as LlecoopProductUnit;

    const product = {
      id: 'p1',
      name: 'Test Product',
      priceWithIva: 10,
      unit: maliciousUnit,
    } as unknown as LlecoopOrderProduct;

    const formattedHtml = priceColumn?.formatting?.execute?.(10, product) as unknown as string;

    expect(formattedHtml).not.toContain('<img');
    expect(formattedHtml).toContain('&lt;img');
  });
});
