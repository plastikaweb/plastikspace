import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct, LlecoopProductUnit } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';

import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  const userOrderStoreMock = {
    selectedItem: signal(null),
  };

  let definition: TableDefinition<LlecoopOrderProduct>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        {
          provide: DomSanitizer,
          useValue: { bypassSecurityTrustHtml: (value: string) => value },
        },
        { provide: llecoopUserOrderStore, useValue: userOrderStoreMock },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserOrderResumeTableConfig).getTableDefinition()
    );
  });

  it('should escape HTML in product base unit text for name formatting', () => {
    const nameColumn = definition.columnProperties().find(col => col.key === 'name');
    expect(nameColumn).toBeDefined();

    const maliciousUnit: LlecoopProductUnit = {
      type: 'unitWithFixedVolume',
      base: '<img src=x onerror=alert(1)>' as unknown as number,
    };

    const product = {
      name: 'Test Product',
      price: 2.5,
      unit: maliciousUnit,
    } as LlecoopOrderProduct;

    const formatted = nameColumn?.formatting?.execute?.(null, product) as string;

    expect(formatted).not.toContain('<img');
    expect(formatted).toContain('&lt;img');
    expect(formatted).toContain('onerror&#x3D;alert(1)');
  });
});
