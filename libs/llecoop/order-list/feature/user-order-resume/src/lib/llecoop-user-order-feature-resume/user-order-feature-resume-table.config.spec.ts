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
          provide: llecoopUserOrderStore,
          useValue: {
            selectedItem: () => null,
          },
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape XSS payloads in unit text for name column', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties();
    const nameCol = columns.find(col => col.key === 'name');

    expect(nameCol).toBeDefined();

    const mockProduct = {
      name: 'Test Product',
      price: 15,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<script>alert("xss")</script>',
      },
    } as unknown as LlecoopOrderProduct;

    const formattedOutput = nameCol?.formatting?.type === 'CUSTOM'
      ? nameCol.formatting.execute('Test Product', mockProduct)
      : '';

    expect(formattedOutput).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(formattedOutput).not.toContain('<script>alert("xss")</script>');
  });
});
