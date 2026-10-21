import { HexToRgbaPipe } from './hex-to-rgba.pipe';

describe('HexToRgbaPipe', () => {
  let pipe: HexToRgbaPipe;

  beforeEach(() => {
    pipe = new HexToRgbaPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('valid conversions', () => {
    it('should convert color hex to rgba', () => {
      expect(pipe.transform('#00FF00', 0.5)).toBe('rgba(0, 255, 0, 0.5)');
    });

    it('should return cached result on subsequent calls with same parameters', () => {
      const result1 = pipe.transform('#123456', 0.8);
      const result2 = pipe.transform('#123456', 0.8);

      expect(result1).toBe('rgba(18, 52, 86, 0.8)');
      expect(result2).toBe(result1);
    });

    it('should handle cache eviction when cache capacity is exceeded', () => {
      // Fill cache up to MAX_CACHE_SIZE (500) + 10 extra entries
      for (let i = 0; i < 510; i++) {
        const hex = `#${i.toString(16).padStart(6, '0')}`;

        expect(pipe.transform(hex as `#${string}`, 0.5)).toContain('rgba(');
      }

      // Verify pipe still functions properly after cache eviction
      expect(pipe.transform('#FFFFFF', 1)).toBe('rgba(255, 255, 255, 1)');
    });
  });

  describe('invalid inputs', () => {
    it('should throw error if hex is shorter than 6 characters', () => {
      expect(() => pipe.transform('#FF000', 0.5)).toThrow('Invalid hex color format');
    });

    it('should throw error if hex contains non-hexadecimal characters', () => {
      expect(() => pipe.transform('#ZZRRGB', 0.5)).toThrow('Invalid hex color format');
    });

    it('should throw error if alpha is greater than 1', () => {
      expect(() => pipe.transform('#FF0000', 2)).toThrow('Alpha value must be between 0 and 1');
    });

    it('should throw error if alpha is less than 0', () => {
      expect(() => pipe.transform('#FF0000', -0.5)).toThrow('Alpha value must be between 0 and 1');
    });
  });
});
