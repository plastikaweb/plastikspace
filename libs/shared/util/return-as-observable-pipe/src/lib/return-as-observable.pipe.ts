import { isObservable, Observable, of } from 'rxjs';

import { Pipe, PipeTransform } from '@angular/core';

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
    return isObservable(value) ? value : of(value);
  }
}
