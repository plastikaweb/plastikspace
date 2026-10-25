import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';

import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let service: LlecoopUserOrderResumeTableConfig;

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

    service = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape malicious unit base text in name column formatting', () => {
    const tableDef = service.getTableDefinition();
    const columnProps = tableDef.columnProperties();
    const nameColumn = columnProps.find(col => col.key === 'name');

    const product: Partial<LlecoopOrderProduct> = {
      name: 'Safe Product',
      price: 5.25,
      unit: {
        type: 'unitWithFixedVolume',
        base: '<script>alert(1)</script>' as unknown as number,
      },
    };

    const formattedHtml = nameColumn?.formatting?.execute?.('', product as LlecoopOrderProduct) as string;

    expect(formattedHtml).toContain('&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
    expect(formattedHtml).not.toContain('<script>alert(1)</script>');
  });
});
