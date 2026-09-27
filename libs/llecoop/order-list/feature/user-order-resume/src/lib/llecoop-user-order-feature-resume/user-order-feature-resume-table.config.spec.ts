import { TestBed } from '@angular/core/testing';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG, TableColumnFormattingCustom } from '@plastik/shared/table/entities';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let service: LlecoopUserOrderResumeTableConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {},
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            selectedItem: vi.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(LlecoopUserOrderResumeTableConfig);
  });

  it('should escape malicious HTML in unit base text for name formatting', () => {
    const tableDef = TestBed.runInInjectionContext(() => service.getTableDefinition());
    const nameColumn = tableDef.columnProperties()?.find(col => col.key === 'name');
    const customFormatting = nameColumn?.formatting as TableColumnFormattingCustom<LlecoopOrderProduct>;

    const productWithXss = {
      name: 'Test Product',
      price: 10,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert("xss")>',
      },
    } as unknown as LlecoopOrderProduct;

    const formatted = customFormatting.execute('Test Product', productWithXss);
    const resultString = (formatted as { changingThisBreaksApplicationSecurity?: string })
      ?.changingThisBreaksApplicationSecurity || String(formatted);

    expect(resultString).not.toContain('<img src=x onerror=alert("xss")>');
    expect(resultString).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(&quot;xss&quot;)&gt;');
  });
});
