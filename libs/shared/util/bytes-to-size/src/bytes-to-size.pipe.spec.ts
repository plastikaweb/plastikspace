import { BytesToSizePipe } from './bytes-to-size.pipe';

describe('BytesToSizePipe', () => {
  let pipe: BytesToSizePipe;

  beforeEach(() => {
    pipe = new BytesToSizePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "n/a" if value is 0, null, or undefined', () => {
    expect(pipe.transform(0)).toBe('n/a');
    expect(pipe.transform(null as any)).toBe('n/a');
    expect(pipe.transform(undefined as any)).toBe('n/a');
  });

  it('should return correct size for Bytes', () => {
    expect(pipe.transform(100)).toBe('100 Bytes');
  });

  it('should return correct size for KB', () => {
    expect(pipe.transform(1024)).toBe('1 KB');
    expect(pipe.transform(2048)).toBe('2 KB');
  });

  it('should return correct size for MB', () => {
    expect(pipe.transform(1048576)).toBe('1 MB');
  });

  it('should return correct size for GB', () => {
    expect(pipe.transform(1073741824)).toBe('1 GB');
  });

  it('should handle fixed precision correctly', () => {
    // 1500 bytes is approx 1.46 KB
    expect(pipe.transform(1500, 2)).toBe('1.46 KB');
    expect(pipe.transform(1500, 0)).toBe('1 KB');
  });
});
