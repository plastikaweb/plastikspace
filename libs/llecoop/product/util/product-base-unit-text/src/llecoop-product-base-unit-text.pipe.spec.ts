import { LlecoopProductUnit } from '@plastik/llecoop/entities';

import { LlecoopProductBaseUnitTextPipe } from './llecoop-product-base-unit-text.pipe';

describe('LlecoopProductBaseUnitTextPipe', () => {
  let pipe: LlecoopProductBaseUnitTextPipe;

  beforeEach(() => {
    pipe = new LlecoopProductBaseUnitTextPipe();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('throws an error when input is null', () => {
    expect(() => {
      // @ts-expect-error - Testing null input
      pipe.transform(null);
    }).toThrowError(
      'Invalid input: LlecoopProductBaseUnitTextPipe expects a LlecoopProductUnit object'
    );
  });

  it('throws an error when input is undefined', () => {
    expect(() => {
      // @ts-expect-error - Testing undefined input
      pipe.transform(undefined);
    }).toThrowError(
      'Invalid input: LlecoopProductBaseUnitTextPipe expects a LlecoopProductUnit object'
    );
  });

  it('throws an error when input does not have type property', () => {
    expect(() => {
      // @ts-expect-error - Testing invalid object structure
      pipe.transform({});
    }).toThrowError(
      'Invalid input: LlecoopProductBaseUnitTextPipe expects a LlecoopProductUnit object'
    );
  });

  it('transforms a "unit" type unit correctly', () => {
    const unit: LlecoopProductUnit = { type: 'unit' };
    expect(pipe.transform(unit)).toBe('unitat');
  });

  it('transforms a "weight" type unit correctly', () => {
    const unit: LlecoopProductUnit = { type: 'weight' };
    expect(pipe.transform(unit)).toBe('per kg');
  });

  it('transforms a "unitWithFixedVolume" type unit correctly', () => {
    const unit: LlecoopProductUnit = { type: 'unitWithFixedVolume', base: 1.5 };
    expect(pipe.transform(unit)).toBe('1.5 l unitat');
  });

  it('transforms a "unitWithFixedWeight" type unit correctly', () => {
    const unit: LlecoopProductUnit = { type: 'unitWithFixedWeight', base: 2 };
    expect(pipe.transform(unit)).toBe('2 kg unitat');
  });

  it('transforms a "unitWithVariableWeight" type unit correctly', () => {
    const unit: LlecoopProductUnit = { type: 'unitWithVariableWeight', base: 0.5 };
    expect(pipe.transform(unit)).toBe('0.5 kg per unitat. Pes aproximat');
  });
});
