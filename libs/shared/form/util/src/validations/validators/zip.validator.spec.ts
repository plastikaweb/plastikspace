import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { zipValidator } from './zip.validator';

describe('zipValidator', () => {
  it('should return null for a valid postal code', () => {
    const control = new FormControl('08001');

    expect(zipValidator(control)).toBeNull();
  });

  it('should return null for the lowest valid postal code', () => {
    const control = new FormControl('01000');

    expect(zipValidator(control)).toBeNull();
  });

  it('should return null for the highest valid postal code', () => {
    const control = new FormControl('52999');

    expect(zipValidator(control)).toBeNull();
  });

  it('should return null when value is empty', () => {
    const control = new FormControl('');

    expect(zipValidator(control)).toBeNull();
  });

  it('should return null when value is null', () => {
    const control = new FormControl(null);

    expect(zipValidator(control)).toBeNull();
  });

  it('should return error for province code 00', () => {
    const control = new FormControl('00123');

    expect(zipValidator(control)).toEqual({ zip: true });
  });

  it('should return error for province code above 52', () => {
    const control = new FormControl('53000');

    expect(zipValidator(control)).toEqual({ zip: true });
  });

  it('should return error for less than 5 digits', () => {
    const control = new FormControl('0800');

    expect(zipValidator(control)).toEqual({ zip: true });
  });

  it('should return error for more than 5 digits', () => {
    const control = new FormControl('080011');

    expect(zipValidator(control)).toEqual({ zip: true });
  });

  it('should return error for non-numeric characters', () => {
    const control = new FormControl('0800a');

    expect(zipValidator(control)).toEqual({ zip: true });
  });
});
