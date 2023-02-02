import { Pipe, PipeTransform } from '@angular/core';
import { isObservable, Observable, of } from 'rxjs';

@Pipe({
  name: 'returnAsObservable',
  standalone: true,
})
export class ReturnAsObservablePipe implements PipeTransform {
  transform(value: unknown): Observable<unknown> {
    return isObservable(value) ? value : of(value);
  }
}
