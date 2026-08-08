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

    it('should convert lower-case hex to rgba', () => {
      expect(pipe.transform('#ff0000', 1)).toBe('rgba(255, 0, 0, 1)');
    });

    it('should convert mixed-case hex to rgba', () => {
      expect(pipe.transform('#AbCdEf', 0)).toBe('rgba(171, 205, 239, 0)');
    });
  });

  describe('caching behavior', () => {
    it('should retrieve result from cache on repeated calls', () => {
      const transformSpy = vi.spyOn(pipe, 'transform');
      const result1 = pipe.transform('#123456', 0.8);
      const result2 = pipe.transform('#123456', 0.8);

      expect(result1).toBe('rgba(18, 52, 86, 0.8)');
      expect(result2).toBe(result1);
      // Even though vi.spyOn tracks calls, the internal execution parses once and returns cached.
      expect(transformSpy).toHaveBeenCalledTimes(2);
    });

    it('should distinguish cache keys by both hex and alpha values', () => {
      const res1 = pipe.transform('#112233', 0.5);
      const res2 = pipe.transform('#112233', 0.6);
      const res3 = pipe.transform('#445566', 0.5);

      expect(res1).toBe('rgba(17, 34, 51, 0.5)');
      expect(res2).toBe('rgba(17, 34, 51, 0.6)');
      expect(res3).toBe('rgba(68, 85, 102, 0.5)');
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

    it('should throw error if hex is longer than 6 characters', () => {
      expect(() => pipe.transform('#FF00000', 0.5)).toThrow('Invalid hex color format');
    });
  });
});
