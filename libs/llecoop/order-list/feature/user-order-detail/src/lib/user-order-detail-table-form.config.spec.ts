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
        LlecoopUserOrderDetailFormTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        LlecoopProductUnitStepPipe,
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (value: string) => value,
          },
        },
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {
            columnProperties: [],
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
            orderProductsSorting: () => ({}),
            orderProductsPagination: () => ({}),
          },
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
  });

  it('should escape XSS payloads in unit text for priceWithIva column', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties();
    const priceWithIvaCol = columns.find(col => col.key === 'priceWithIva');

    expect(priceWithIvaCol).toBeDefined();

    const mockElement = {
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>',
      },
    } as unknown as LlecoopOrderProduct;

    const formattedOutput = priceWithIvaCol?.formatting?.type === 'CUSTOM'
      ? priceWithIvaCol.formatting.execute(10, mockElement)
      : '';

    expect(formattedOutput).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    expect(formattedOutput).not.toContain('<img src=x onerror=alert(1)>');
  });
});
