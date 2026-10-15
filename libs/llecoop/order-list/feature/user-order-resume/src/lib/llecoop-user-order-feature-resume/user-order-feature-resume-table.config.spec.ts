import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  const userOrderStore = {
    selectedItem: signal(null),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        { provide: llecoopUserOrderStore, useValue: userOrderStore },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (value: string) => value as unknown as SafeHtml,
          },
        },
      ],
    });
  });

  it('should escape HTML in product unit when formatting name column', () => {
    const config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties();
    const nameCol = columns.find(col => col.key === 'name');

    expect(nameCol).toBeDefined();

    const productWithXssUnit = {
      name: 'Product Name',
      price: 2.5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>',
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = nameCol?.formatting?.execute?.('', productWithXssUnit) as string;

    expect(formatted).not.toContain('<img');
    expect(formatted).toContain('&lt;img');
  });
});
