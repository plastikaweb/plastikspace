import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct, LlecoopProductUnit } from '@plastik/llecoop/entities';
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
          useValue: {
            selectedItem: signal(null),
          },
        },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape HTML in product unit string rendered in name formatting', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columnProps = tableDef.columnProperties();
    const nameColumn = columnProps.find(col => col.key === 'name');

    const mockProduct = {
      name: 'Test Product',
      price: 5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<script>alert("xss")</script>',
      } as unknown as LlecoopProductUnit,
    } as LlecoopOrderProduct;

    const result = nameColumn?.formatting?.execute?.(null, mockProduct) as unknown as string;

    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });
});
