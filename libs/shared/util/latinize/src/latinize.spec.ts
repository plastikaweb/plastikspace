import { latinize } from './latinize';

describe('latinize', () => {
  it('should not change ASCII characters', () => {
    expect(latinize('Hello World 123')).toBe('Hello World 123');
  });

  it('should replace non-ASCII characters with their Latin equivalents', () => {
    expect(latinize('ÁáĂă')).toBe('AaAa');
  });

  it('should handle mixed strings', () => {
    expect(latinize('The café is in Bogotá')).toBe('The cafe is in Bogota');
  });

  it('should leave unknown non-ASCII characters as is', () => {
    expect(latinize('©®')).toBe('©®');
  });

  it('should correctly handle Cyrillic characters with proper casing', () => {
    expect(latinize('А я')).toBe('A ya');
    expect(latinize('Я Б')).toBe('YA B');
  });
});
