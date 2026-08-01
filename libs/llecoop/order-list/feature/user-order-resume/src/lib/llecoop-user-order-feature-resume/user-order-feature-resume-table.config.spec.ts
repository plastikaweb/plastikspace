import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  const userOrderStoreMock = {
    selectedItem: signal(null),
  };

  let config: LlecoopUserOrderResumeTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (val: string) => val } },
        { provide: llecoopUserOrderStore, useValue: userOrderStoreMock },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape unit pipe output in the name column formatter to prevent XSS', () => {
    const tableDefinition = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDefinition.columnProperties();
    const nameColumn = columns.find(col => col.key === 'name');

    expect(nameColumn).toBeTruthy();
    expect(nameColumn?.formatting?.type).toBe('CUSTOM');

    // Create a product with a malicious base value that will be interpolated in the pipe
    const maliciousProduct = {
      name: 'Product A',
      price: 10,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<script>alert(1)</script>' as any,
      },
    } as any as LlecoopOrderProduct;

    const rendered = nameColumn?.formatting?.execute?.('Product A', maliciousProduct) as string;

    expect(rendered).not.toContain('<script>');
    expect(rendered).toContain('&lt;script&gt;');
  });
});
