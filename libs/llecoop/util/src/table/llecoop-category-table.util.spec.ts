import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BaseEntity } from '@plastik/core/entities';
import { FormattingComponentOutput } from '@plastik/shared/formatters';

import { categoryNameCell } from './llecoop-category-table.util';

interface MockEntity extends BaseEntity {
  category?: {
    name?: string;
  };
}

describe('categoryNameCell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
  });

  it('should return a formatting configuration with default values', () => {
    const config = categoryNameCell<MockEntity>({});
    expect(config.key).toBe('name');
    expect(config.title).toBe('Categoria');
    expect(config.propertyPath).toBe('category.name');
    expect(config.formatting.type).toBe('COMPONENT');
  });

  it('should execute with the correct component and inputs', () => {
    const entity: MockEntity = {
      id: 1,
      name: 'Apples',
      normalizedName: 'apples',
      category: { name: 'Vegetables' },
    };
    const config = categoryNameCell<MockEntity>({});
    const result = config.formatting.execute?.(null, entity) as FormattingComponentOutput;
    expect(result?.inputs).toEqual({ category: entity.category, nameStyle: '', withLink: false });
  });

  it('should handle missing category gracefully', () => {
    const entity: MockEntity = { id: 2, name: 'Oranges', normalizedName: 'oranges' };
    const config = categoryNameCell<MockEntity>({});
    const result = config.formatting.execute?.(null, entity) as FormattingComponentOutput;
    expect(result?.inputs).toEqual({ category: null, nameStyle: '', withLink: false });
  });
});
