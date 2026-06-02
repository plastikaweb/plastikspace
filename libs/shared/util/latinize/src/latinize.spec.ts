import { describe, expect, it } from 'vitest';
import { latinize } from './latinize';

describe('latinize', () => {
  it('should return the same string if it only contains ASCII characters', () => {
    const input = 'Hello World 123!@#$%^&*()_+';
    expect(latinize(input)).toBe(input);
  });

  it('should latinize accented characters', () => {
    expect(latinize('Áéíóú')).toBe('Aeiou');
    expect(latinize('àèìòù')).toBe('aeiou');
    expect(latinize('ñÑ')).toBe('nN');
    expect(latinize('çÇ')).toBe('cC');
  });

  it('should latinize Cyrillic characters', () => {
    expect(latinize('Привет')).toBe('Privet');
    expect(latinize('Мир')).toBe('Mir');
  });

  it('should handle complex ligatures and special forms', () => {
    expect(latinize('æ')).toBe('ae');
    expect(latinize('ß')).toBe('ss');
    expect(latinize('Þ')).toBe('TH');
    expect(latinize('œ')).toBe('oe');
  });

  it('should preserve punctuation and spaces', () => {
    const input = '¿Hola, qué tal? (100%)';
    const expected = '¿Hola, que tal? (100%)';
    expect(latinize(input)).toBe(expected);
  });
});
