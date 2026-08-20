import { runInInjectionContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopOrderProduct } from '@plastik/llecoop/entities';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { DEFAULT_TABLE_CONFIG, TableColumnFormatting } from '@plastik/shared/table/entities';
import { describe, expect, it, vi } from 'vitest';
import { LlecoopUserOrderResumeTableConfig } from './user-order-feature-resume-table.config';

describe('LlecoopUserOrderResumeTableConfig', () => {
  it('should sanitize unit text in name column against XSS', () => {
    const mockSanitizer = {
      bypassSecurityTrustHtml: vi.fn((val: string) => val),
    };
    const mockPipe = {
      transform: vi.fn().mockReturnValue('<img src=x onerror=alert(1)>'),
    };

    const mockInjector = {
      get(token: unknown) {
        if (token === DomSanitizer) return mockSanitizer;
        if (token === LlecoopProductBaseUnitTextPipe) return mockPipe;
        if (token === DEFAULT_TABLE_CONFIG) return {};
        return {
          selectedItem: vi.fn(),
        };
      },
    };

    runInInjectionContext(mockInjector as any, () => {
      const config = new LlecoopUserOrderResumeTableConfig();
      const definition = config.getTableDefinition();
      const columns = definition.columnProperties();
      const column = columns.find(col => col.key === 'name') as TableColumnFormatting<
        LlecoopOrderProduct,
        'CUSTOM'
      >;

      const product = {
        name: 'Product X',
        price: 5,
        unit: { type: 'weight', base: '<img src=x onerror=alert(1)>' },
      } as unknown as LlecoopOrderProduct;

      const result = column.formatting?.execute?.('Product X', product) as string;

      expect(result).not.toContain('<img src=x onerror=alert(1)>');
      expect(result).toContain('&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
    });
  });
});
