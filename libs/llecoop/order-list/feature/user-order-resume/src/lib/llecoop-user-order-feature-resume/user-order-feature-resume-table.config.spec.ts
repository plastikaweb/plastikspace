import { EnvironmentInjector, provideZonelessChangeDetection } from '@angular/core';
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
        provideZonelessChangeDetection(),
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
          useValue: {
            selectedItem: () => null,
          },
        },
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {},
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape malicious HTML in product unit text in resume table', () => {
    const envInjector = TestBed.inject(EnvironmentInjector);
    const tableDef = envInjector.runInContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties();
    const nameColumn = columns.find(col => col.key === 'name');

    const mockProduct: Partial<LlecoopOrderProduct> = {
      name: 'Test Product',
      price: 5,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<script>alert("XSS")</script>' as unknown as number,
      },
    };

    const formatted = nameColumn?.formatting?.execute?.(
      '',
      mockProduct as LlecoopOrderProduct
    ) as string;

    expect(formatted).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    expect(formatted).not.toContain('<script>alert("XSS")</script>');
  });
});
