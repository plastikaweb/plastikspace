import { LlecoopProductUnit } from '@plastik/llecoop/entities';

import { LlecoopProductUnitStepPipe } from './llecoop-product-unit-step.pipe';

describe('LlecoopProductUnitStepPipe', () => {
  let pipe: LlecoopProductUnitStepPipe;

  beforeEach(() => {
    pipe = new LlecoopProductUnitStepPipe();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('throws an error when input is null', () => {
    expect(() => {
      // @ts-expect-error - Testing null input
      pipe.transform(null);
    }).toThrowError(
      'Invalid input: LlecoopProductUnitStepPipe expects a LlecoopProductUnit object'
    );
  });

  it('throws an error when input is undefined', () => {
    expect(() => {
      // @ts-expect-error - Testing undefined input
      pipe.transform(undefined);
    }).toThrowError(
      'Invalid input: LlecoopProductUnitStepPipe expects a LlecoopProductUnit object'
    );
  });

  it('throws an error when input does not have type property', () => {
    expect(() => {
      // @ts-expect-error - Testing invalid object structure
      pipe.transform({});
    }).toThrowError(
      'Invalid input: LlecoopProductUnitStepPipe expects a LlecoopProductUnit object'
    );
  });

  it('transforms a "weight" type unit correctly returning 0.1', () => {
    const unit: LlecoopProductUnit = { type: 'weight' };
    expect(pipe.transform(unit)).toBe(0.1);
  });

  it('transforms non-"weight" type units returning 1.0', () => {
    const unitTypes: LlecoopProductUnit[] = [
      { type: 'unit' },
      { type: 'unitWithFixedVolume', base: 1.5 },
      { type: 'unitWithFixedWeight', base: 2 },
      { type: 'unitWithVariableWeight', base: 0.5 },
    ];

    unitTypes.forEach(unit => {
      expect(pipe.transform(unit)).toBe(1.0);
    });
  });
});
