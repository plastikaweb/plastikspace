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
  });

  describe('invalid inputs', () => {
    it('should throw error if hex is shorter than 6 characters', () => {
      expect(() => pipe.transform('#FF000', 0.5)).toThrowError('Invalid hex color format');
    });

    it('should throw error if hex contains non-hexadecimal characters', () => {
      expect(() => pipe.transform('#ZZRRGB', 0.5)).toThrowError('Invalid hex color format');
    });

    it('should throw error if alpha is greater than 1', () => {
      expect(() => pipe.transform('#FF0000', 2)).toThrowError(
        'Alpha value must be between 0 and 1'
      );
    });

    it('should throw error if alpha is less than 0', () => {
      expect(() => pipe.transform('#FF0000', -0.5)).toThrowError(
        'Alpha value must be between 0 and 1'
      );
    });
  });
});
