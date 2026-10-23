import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
            bypassSecurityTrustHtml: (value: string) => value as unknown as SafeHtml,
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

  it('should escape malicious HTML in base unit text in name column execute()', () => {
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());
    const columns = tableDef.columnProperties();
    const nameColumn = columns.find(col => col.key === 'name');

    expect(nameColumn).toBeTruthy();

    const mockProduct = {
      name: 'Test Product',
      price: 10,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<img src=x onerror=alert(1)>',
      },
    } as unknown as LlecoopOrderProduct;

    const result = nameColumn?.formatting.execute?.('Test Product', mockProduct) as string;

    expect(result).not.toContain('<img src=x onerror=alert(1)>');
    expect(result).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
  });
});
