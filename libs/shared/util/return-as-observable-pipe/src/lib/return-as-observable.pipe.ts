import { isObservable, Observable, of } from 'rxjs';

import { Pipe, PipeTransform } from '@angular/core';

// Static singleton observables for common primitive default values to avoid allocations on hot change detection paths.
const NULL_OBSERVABLE = of(null);
const UNDEFINED_OBSERVABLE = of(undefined);
const TRUE_OBSERVABLE = of(true);
const FALSE_OBSERVABLE = of(false);
const EMPTY_STRING_OBSERVABLE = of('');
const ZERO_OBSERVABLE = of(0);

@Pipe({
  name: 'returnAsObservable',
})
export class ReturnAsObservablePipe implements PipeTransform {
  /**
   * @description Transforms a value or an Observable of a value into an Observable of the same type.
   * @param {unknown | Observable<unknown>} value The value or Observable to transform.
   * @returns { Observable<unknown> } An Observable of the same type as the input.
   */
  transform<T>(value: T | Observable<T>): Observable<T> {
    if (isObservable(value)) {
      return value;
    }

    if (value === null) {
      return NULL_OBSERVABLE as Observable<T>;
    }
    if (value === undefined) {
      return UNDEFINED_OBSERVABLE as Observable<T>;
    }
    if (value === true) {
      return TRUE_OBSERVABLE as Observable<T>;
    }
    if (value === false) {
      return FALSE_OBSERVABLE as Observable<T>;
    }
    if (value === '') {
      return EMPTY_STRING_OBSERVABLE as Observable<T>;
    }
    if (value === 0) {
      return ZERO_OBSERVABLE as Observable<T>;
    }

    return of(value);
  }
}
