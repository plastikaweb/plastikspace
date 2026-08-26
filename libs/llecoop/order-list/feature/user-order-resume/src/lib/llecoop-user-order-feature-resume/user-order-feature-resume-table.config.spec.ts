import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { llecoopUserOrderStore } from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { DEFAULT_TABLE_CONFIG } from '@plastik/shared/table/entities';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  const mockDomSanitizer = {
    bypassSecurityTrustHtml: vi.fn((val: string) => val),
  };

  const mockProductBaseUnitTextPipe = {
    transform: vi.fn((unit: { type: string; base?: string }) => `${unit.base} kg unitat`),
  };

  const mockProductUnitSuffixPipe = {
    transform: vi.fn(() => 'kg'),
  };

  const mockUserOrderStore = {
    selectedItem: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DomSanitizer, useValue: mockDomSanitizer },
        { provide: LlecoopProductBaseUnitTextPipe, useValue: mockProductBaseUnitTextPipe },
        { provide: LlecoopProductUnitSuffixPipe, useValue: mockProductUnitSuffixPipe },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
        { provide: llecoopUserOrderStore, useValue: mockUserOrderStore },
      ],
    });
  });

  it('should escape malicious HTML in unit text formatting to prevent XSS', () => {
    const config = TestBed.runInInjectionContext(() => new LlecoopUserOrderResumeTableConfig());
    const tableDef = TestBed.runInInjectionContext(() => config.getTableDefinition());

    const nameCol = tableDef.columnProperties().find(col => col.key === 'name');
    expect(nameCol).toBeDefined();

    const maliciousUnit = {
      type: 'unitWithFixedWeight',
      base: '<script>alert("xss")</script>',
    };

    const product = {
      name: 'Product Name',
      price: 5,
      unit: maliciousUnit as never,
    } as LlecoopOrderProduct;

    const result = nameCol?.formatting?.execute?.('Product Name', product) as unknown as string;

    expect(result).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(result).not.toContain('<script>alert("xss")</script>');
  });
});
