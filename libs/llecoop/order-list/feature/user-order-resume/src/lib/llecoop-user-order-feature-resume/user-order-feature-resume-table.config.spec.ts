import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';

import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  const userOrderStoreMock = {
    selectedItem: signal(null),
  };

  let config: LlecoopUserOrderResumeTableConfig;
  let tableDef: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        { provide: llecoopUserOrderStore, useValue: userOrderStoreMock },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
    tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
  });

  it('should escape HTML in the product unit base text to prevent XSS in name column', () => {
    const nameColumn = tableDef.columnProperties().find(col => col.key === 'name');
    expect(nameColumn).toBeDefined();

    const product = {
      name: 'Test Product',
      price: 5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert("XSS")>',
      },
    } as unknown as LlecoopOrderProduct;

    const result = nameColumn?.formatting?.execute?.(undefined, product) as unknown as {
      changingThisBreaksApplicationSecurity: string;
    };

    const renderedHtml = result.changingThisBreaksApplicationSecurity;
    expect(renderedHtml).not.toContain('<img src=x onerror=alert("XSS")>');
    expect(renderedHtml).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(&quot;XSS&quot;)&gt;');
  });
});
