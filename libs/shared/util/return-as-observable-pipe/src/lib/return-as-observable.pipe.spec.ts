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
    expect(isObservable(pipe.transform(of('string')))).toBeTruthy();
  });
});
