import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { nifValidator } from './nif.validator';

describe('nifValidator', () => {
  it('should return null for a valid DNI with correct control letter', () => {
    const control = new FormControl('12345678Z');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return null for a valid lowercase DNI', () => {
    const control = new FormControl('12345678z');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return error for a DNI with wrong control letter', () => {
    const control = new FormControl('12345678A');

    expect(nifValidator(control)).toEqual({ nif: true });
  });

  it('should return null for a valid NIE starting with X', () => {
    const control = new FormControl('X1234567L');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return null for a valid NIE starting with Y', () => {
    const control = new FormControl('Y1234567X');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return error for a NIE with wrong control letter', () => {
    const control = new FormControl('X1234567A');

    expect(nifValidator(control)).toEqual({ nif: true });
  });

  it('should return null for a CIF with correct numeric checksum', () => {
    // digits 1234567 -> check digit 4 (verified by hand and against ajpdsoft.com's algorithm)
    const control = new FormControl('B12345674');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return null for a CIF with correct letter checksum', () => {
    // same digits as above (check digit 4 -> letter D via JABCDEFGHI table)
    const control = new FormControl('Q1234567D');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return null for a real-world CIF example (Wikipedia worked example)', () => {
    const control = new FormControl('A58818501');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return null for a real-world CIF example (python-stdnum doctest, numeric form)', () => {
    const control = new FormControl('J99216582');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return null for the same CIF digits in letter form', () => {
    const control = new FormControl('J9921658B');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return null for a real-world CIF example (ajpdsoft.com worked example)', () => {
    const control = new FormControl('E73467433');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return error for a CIF with a well-formed but incorrect checksum', () => {
    const control = new FormControl('J99216583');

    expect(nifValidator(control)).toEqual({ nif: true });
  });

  it('should return error for a CIF with wrong length', () => {
    const control = new FormControl('B1234567');

    expect(nifValidator(control)).toEqual({ nif: true });
  });

  it('should return null when value is empty', () => {
    const control = new FormControl('');

    expect(nifValidator(control)).toBeNull();
  });

  it('should return null when value is null', () => {
    const control = new FormControl(null);

    expect(nifValidator(control)).toBeNull();
  });

  it('should return error for arbitrary text', () => {
    const control = new FormControl('not-a-nif');

    expect(nifValidator(control)).toEqual({ nif: true });
  });

  it('should ignore surrounding whitespace', () => {
    const control = new FormControl(' 12345678Z ');

    expect(nifValidator(control)).toBeNull();
  });
});
