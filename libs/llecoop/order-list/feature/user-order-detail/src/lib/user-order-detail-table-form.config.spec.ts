import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SafeHtml } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableColumnFormatting } from '@plastik/shared/table/entities';
import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  let config: LlecoopUserOrderDetailFormTableConfig;

  const mockOrderListStore = {
    currentOrderCount: signal(0),
    currentOrderAvailableProducts: signal([]),
  };

  const mockUserOrderStore = {
    orderProductsSorting: signal(['name', 'asc']),
    orderProductsPagination: signal({ pageIndex: 0, pageSize: 10 }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        { provide: llecoopOrderListStore, useValue: mockOrderListStore },
        { provide: llecoopUserOrderStore, useValue: mockUserOrderStore },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape HTML in unit base name when formatting priceWithIva column', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties() as TableColumnFormatting<LlecoopOrderProduct, 'CUSTOM'>[];
    const priceWithIvaCol = columns.find(col => col.key === 'priceWithIva');

    const productWithXss = {
      id: 'p1',
      name: 'Test Product',
      priceWithIva: 5.5,
      unit: {
        type: 'unitWithFixedWeight' as const,
        base: '<img src=x onerror=alert(1)>',
      },
    } as unknown as LlecoopOrderProduct;

    const result = priceWithIvaCol?.formatting?.execute?.(5.5, productWithXss) as SafeHtml & {
      changingThisBreaksApplicationSecurity?: string;
    };

    const renderedHtml = result?.changingThisBreaksApplicationSecurity ?? String(result);

    expect(renderedHtml).not.toContain('<img');
    expect(renderedHtml).toContain('&lt;img');
  });
});
