import { latinize } from './latinize';

describe('latinize', () => {
  it('should return ASCII characters as is', () => {
    const input = 'Hello World 123! @#$%^&*()_+';
    expect(latinize(input)).toBe(input);
  });

  it('should latinize accented characters', () => {
    expect(latinize('áéíóúñ')).toBe('aeioun');
    expect(latinize('ÁÉÍÓÚÑ')).toBe('AEIOUN');
  });

  it('should latinize complex characters', () => {
    expect(latinize('ÆŒ')).toBe('AEOE');
    expect(latinize('ß')).toBe('ss');
  });

  it('should latinize Cyrillic characters', () => {
    expect(latinize('ёйцукенг')).toBe('yoitsukeng');
    expect(latinize('ЁЙЦУКЕНГ')).toBe('YOITSUKENG');
  });

  it('should handle empty string', () => {
    expect(latinize('')).toBe('');
  });

  it('should handle strings with mixed characters', () => {
    expect(latinize('Hello áéíóú! 123')).toBe('Hello aeiou! 123');
  });

  it('should return the character if no mapping exists', () => {
    // Assuming some emoji or character not in the map
    const input = 'Hello 🚀';
    expect(latinize(input)).toBe(input);
  });
});
