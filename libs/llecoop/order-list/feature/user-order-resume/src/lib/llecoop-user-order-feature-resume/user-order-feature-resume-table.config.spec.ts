import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';
import { describe, expect, it, beforeEach } from 'vitest';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  let config: LlecoopUserOrderResumeTableConfig;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LlecoopUserOrderResumeTableConfig,
        LlecoopProductBaseUnitTextPipe,
        LlecoopProductUnitSuffixPipe,
        {
          provide: DEFAULT_TABLE_CONFIG,
          useValue: {
            columnProperties: [],
          },
        },
        {
          provide: llecoopUserOrderStore,
          useValue: {
            selectedItem: () => ({ cart: [] }),
          },
        },
      ],
    });

    config = TestBed.inject(LlecoopUserOrderResumeTableConfig);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should escape malicious script payload in unit.base for name column', () => {
    const tableDef = TestBed.runInInjectionContext(() =>
      config.getTableDefinition()
    );
    const columns = tableDef.columnProperties();
    const nameCol = columns.find(col => col.key === 'name');

    expect(nameCol).toBeDefined();

    const mockProduct = {
      name: 'Product Test',
      price: 5,
      unit: {
        type: 'unitWithFixedWeight',
        base: '<img src=x onerror=alert(1)>',
      },
    } as unknown as LlecoopOrderProduct;

    if (nameCol?.formatting?.type === 'CUSTOM') {
      const result = nameCol.formatting.execute(
        mockProduct.name,
        mockProduct
      );
      const sanitizedHtml = sanitizer.sanitize(1, result) ?? String(result);

      expect(sanitizedHtml).not.toContain('<img src=x onerror=alert(1)>');
      expect(sanitizedHtml).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    }
  });
});
