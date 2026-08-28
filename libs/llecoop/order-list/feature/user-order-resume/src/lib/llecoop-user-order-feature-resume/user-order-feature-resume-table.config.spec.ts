import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let config: LlecoopUserOrderResumeTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val,
          },
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

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape malicious XSS in unit base text for name column', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const nameCol = tableDef.columnProperties().find(col => col.key === 'name');

    const mockProduct = {
      name: 'Test Product',
      price: 5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>' as unknown as number,
      },
    } as LlecoopOrderProduct;

    const result = nameCol?.formatting?.execute?.(null, mockProduct);
    expect(result).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    expect(result).not.toContain('<img src=x onerror=alert(1)>');
  });
});
