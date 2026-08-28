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
  let sanitizer: DomSanitizer;

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
          useValue: {},
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {},
        },
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {},
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderDetailFormTableConfig);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should escape malicious XSS in unit base text for priceWithIva column', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const priceCol = tableDef.columnProperties().find(col => col.key === 'priceWithIva');

    const mockProduct = {
      priceWithIva: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    } as LlecoopOrderProduct;

    const result = priceCol?.formatting?.execute?.(10, mockProduct);
    expect(result).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    expect(result).not.toContain('<img src=x onerror=alert(1)>');
  });
});
