import { ElementRef, Injector, runInInjectionContext } from '@angular/core';
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
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderDetailFormTableConfig,
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: { columnProperties: () => [] },
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
          provide: LlecoopProductBaseUnitTextPipe,
          useValue: {
            transform: (unit: unknown) => (unit as { base: string })?.base ?? '',
          },
        },
        {
          provide: LlecoopProductUnitSuffixPipe,
          useValue: {
            transform: () => 'kg',
          },
        },
        {
          provide: LlecoopProductUnitStepPipe,
          useValue: {
            transform: () => 1,
          },
        },
      ],
    });

    injector = TestBed.inject(Injector);
    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape XSS payloads in product unit inside priceWithIva formatting', () => {
    const tableDef = runInInjectionContext(injector, () => config.getTableDefinition());
    const priceCol = tableDef.columnProperties().find(col => col.key === 'priceWithIva');

    const mockProduct = {
      priceWithIva: 5,
      unit: { base: '<img src=x onerror=alert(1)>' },
    } as unknown as LlecoopOrderProduct;

    const result = priceCol?.formatting?.execute?.(5, mockProduct);
    const htmlString = (result as unknown as { changingThisBreaksApplicationSecurity: string })
      ?.changingThisBreaksApplicationSecurity;

    expect(htmlString).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    expect(htmlString).not.toContain('<img src=x onerror=alert(1)>');
  });
});
