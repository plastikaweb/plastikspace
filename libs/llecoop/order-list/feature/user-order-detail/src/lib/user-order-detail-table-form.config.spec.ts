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
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';
import { LlecoopUserOrderDetailFormTableConfig } from './user-order-detail-table-form.config';

describe('LlecoopUserOrderDetailFormTableConfig', () => {
  const mockOrderListStore = {
    currentOrderCount: signal(0),
    currentOrderAvailableProducts: signal([]),
  };

  const mockUserOrderStore = {
    orderProductsSorting: signal(['name', 'asc']),
    orderProductsPagination: signal({ pageIndex: 0, pageSize: 10 }),
  };

  let config: LlecoopUserOrderDetailFormTableConfig;
  let definition: TableDefinition<LlecoopOrderProduct>;

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
    definition = TestBed.runInInjectionContext(() => config.getTableDefinition());
  });

  it('should escape HTML in unit base text in priceWithIva column formatting', () => {
    const columns = definition.columnProperties();
    const priceWithIvaCol = columns.find(col => col.key === 'priceWithIva');

    expect(priceWithIvaCol).toBeTruthy();

    const mockProduct = {
      priceWithIva: 2.5,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<img src=x onerror=alert(1)>',
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = priceWithIvaCol?.formatting?.execute?.(2.5, mockProduct) as SafeHtml & {
      changingThisBreaksApplicationSecurity?: string;
    };

    const htmlString = formatted?.changingThisBreaksApplicationSecurity || String(formatted);

    expect(htmlString).not.toContain('<img');
    expect(htmlString).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
  });
});
