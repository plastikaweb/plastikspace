import { Pipe, PipeTransform } from '@angular/core';
import { Observable, isObservable, of } from 'rxjs';

@Pipe({
  name: 'returnAsObservable',
  standalone: true,
})
export class ReturnAsObservablePipe implements PipeTransform {
  /**
   * Transforms a value or an Observable of a value into an Observable of the same type.
   *
   * @param {unknown | Observable<unknown>} value The value or Observable to transform.
   * @returns { Observable<unknown> } An Observable of the same type as the input.
   */
  transform<T>(value: T | Observable<T>): Observable<T> {
    return isObservable(value) ? value : of(value);
  }
}
