import { describe, expect, it } from 'vitest';
import { latinize } from './latinize';

describe('latinize', () => {
  it('should convert accented characters to their latin equivalents', () => {
    expect(latinize('áéíóú')).toBe('aeiou');
    expect(latinize('ÁÉÍÓÚ')).toBe('AEIOU');
    expect(latinize('àèìòù')).toBe('aeiou');
    expect(latinize('ÀÈÌÒÙ')).toBe('AEIOU');
    expect(latinize('âêîôû')).toBe('aeiou');
    expect(latinize('ÂÊÎÔÛ')).toBe('AEIOU');
    expect(latinize('äëïöü')).toBe('aeiou');
    expect(latinize('ÄËÏÖÜ')).toBe('AEIOU');
  });

  it('should handle tilde characters', () => {
    expect(latinize('mañana')).toBe('manana');
    expect(latinize('MAÑANA')).toBe('MANANA');
  });

  it('should handle mixed strings', () => {
    expect(latinize('Héllö Wörld 123!')).toBe('Hello World 123!');
  });

  it('should return empty string if input is empty', () => {
    expect(latinize('')).toBe('');
  });

  it('should return same string if no accented characters', () => {
    expect(latinize('Hello World')).toBe('Hello World');
  });
});
