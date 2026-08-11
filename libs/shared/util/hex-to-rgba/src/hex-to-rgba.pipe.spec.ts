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

    it('should parse other hex patterns correctly using bitwise logic', () => {
      expect(pipe.transform('#FFFFFF', 1)).toBe('rgba(255, 255, 255, 1)');
      expect(pipe.transform('#000000', 0)).toBe('rgba(0, 0, 0, 0)');
      expect(pipe.transform('#FF0000', 0.8)).toBe('rgba(255, 0, 0, 0.8)');
    });

    it('should cache previous conversion results', () => {
      const transformSpy = vi.spyOn(pipe, 'transform');

      const firstRun = pipe.transform('#00FF00', 0.5);
      const secondRun = pipe.transform('#00FF00', 0.5);

      expect(firstRun).toBe('rgba(0, 255, 0, 0.5)');
      expect(secondRun).toBe('rgba(0, 255, 0, 0.5)');
      expect(transformSpy).toHaveBeenCalledTimes(2); // Since it is called through spy, but under the hood memoization works. Let's spy on Map.prototype.get to be absolutely sure.
    });

    it('should retrieve from Map cache on repeated invocations', () => {
      const getSpy = vi.spyOn(Map.prototype, 'get');
      const setSpy = vi.spyOn(Map.prototype, 'set');

      const color = '#FF00FF';
      const alpha = 0.3;

      // First invocation - Cache miss
      const res1 = pipe.transform(color, alpha);
      expect(res1).toBe('rgba(255, 0, 255, 0.3)');
      expect(getSpy).toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalledWith(`${color}_${alpha}`, 'rgba(255, 0, 255, 0.3)');

      getSpy.mockClear();
      setSpy.mockClear();

      // Second invocation - Cache hit
      const res2 = pipe.transform(color, alpha);
      expect(res2).toBe('rgba(255, 0, 255, 0.3)');
      expect(getSpy).toHaveBeenCalled();
      expect(setSpy).not.toHaveBeenCalled();

      getSpy.mockRestore();
      setSpy.mockRestore();
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
