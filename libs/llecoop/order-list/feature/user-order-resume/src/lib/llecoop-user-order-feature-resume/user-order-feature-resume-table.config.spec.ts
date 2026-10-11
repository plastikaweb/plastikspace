import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let config: LlecoopUserOrderResumeTableConfig;

  const mockUserOrderStore = {
    selectedItem: signal(null),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        { provide: llecoopUserOrderStore, useValue: mockUserOrderStore },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape HTML in unit text to prevent XSS in name column', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties();
    const nameColumn = columns.find(col => col.key === 'name');

    expect(nameColumn).toBeDefined();

    const productWithXssUnit: Partial<LlecoopOrderProduct> = {
      name: 'Test Product',
      price: 5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<script>alert("xss")</script>' as unknown as number,
      },
    };

    const result = nameColumn?.formatting?.execute?.(
      'Test Product',
      productWithXssUnit as LlecoopOrderProduct
    );
    const htmlString = (result as { changingThisBreaksApplicationSecurity: string })
      ?.changingThisBreaksApplicationSecurity;

    expect(htmlString).not.toContain('<script>');
    expect(htmlString).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });
});
