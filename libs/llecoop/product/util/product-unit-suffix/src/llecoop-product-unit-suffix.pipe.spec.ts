import { LlecoopProductUnit } from '@plastik/llecoop/entities';

import { LlecoopProductUnitSuffixPipe } from './llecoop-product-unit-suffix.pipe';

describe('LlecoopProductUnitSuffixPipe', () => {
  let pipe: LlecoopProductUnitSuffixPipe;

  beforeEach(() => {
    pipe = new LlecoopProductUnitSuffixPipe();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms a "weight" type unit correctly returning "kg"', () => {
    const unit: LlecoopProductUnit = { type: 'weight' };
    expect(pipe.transform(unit)).toBe('kg');
  });

  it('throws an error when input is null', () => {
    expect(() => {
      // @ts-expect-error - Testing null input
      pipe.transform(null);
    }).toThrowError(
      'Invalid input: LlecoopProductUnitSuffixPipe expects a LlecoopProductUnit object'
    );
  });

  it('throws an error when input is undefined', () => {
    expect(() => {
      // @ts-expect-error - Testing undefined input
      pipe.transform(undefined);
    }).toThrowError(
      'Invalid input: LlecoopProductUnitSuffixPipe expects a LlecoopProductUnit object'
    );
  });

  it('throws an error when input does not have type property', () => {
    expect(() => {
      // @ts-expect-error - Testing invalid object structure
      pipe.transform({});
    }).toThrowError(
      'Invalid input: LlecoopProductUnitSuffixPipe expects a LlecoopProductUnit object'
    );
  });

  it('transforms non-"weight" type units correctly returning "u"', () => {
    const unitTypes: LlecoopProductUnit[] = [
      { type: 'unit' },
      { type: 'unitWithFixedVolume', base: 1.5 },
      { type: 'unitWithFixedWeight', base: 2 },
      { type: 'unitWithVariableWeight', base: 0.5 },
    ];

    unitTypes.forEach(unit => {
      expect(pipe.transform(unit)).toBe('u');
    });
  });
});
