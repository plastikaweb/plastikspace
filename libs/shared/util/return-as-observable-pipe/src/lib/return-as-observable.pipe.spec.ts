import { isObservable, of } from 'rxjs';

import { ReturnAsObservablePipe } from './return-as-observable.pipe';

describe('ReturnAsObservablePipe', () => {
  let pipe: ReturnAsObservablePipe;

  beforeEach(() => {
    pipe = new ReturnAsObservablePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an observable if argument is not an observable', () => {
    expect(isObservable(pipe.transform('string'))).toBeTruthy();
  });

  it('should return an observable if argument is an observable', () => {
    const obs$ = of('string');
    expect(isObservable(pipe.transform(obs$))).toBeTruthy();
    expect(pipe.transform(obs$)).toBe(obs$);
  });

  it('should return static cached observable singletons for common primitives', () => {
    expect(pipe.transform(null)).toBe(pipe.transform(null));
    expect(pipe.transform(undefined)).toBe(pipe.transform(undefined));
    expect(pipe.transform(true)).toBe(pipe.transform(true));
    expect(pipe.transform(false)).toBe(pipe.transform(false));
    expect(pipe.transform('')).toBe(pipe.transform(''));
    expect(pipe.transform(0)).toBe(pipe.transform(0));
  });

  it('should emit expected values from cached and uncached observables', async () => {
    let result: unknown;

    pipe.transform(null).subscribe(v => (result = v));
    expect(result).toBeNull();

    pipe.transform(true).subscribe(v => (result = v));
    expect(result).toBe(true);

    pipe.transform(42).subscribe(v => (result = v));
    expect(result).toBe(42);
  });
});
