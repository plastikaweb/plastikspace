import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENVIRONMENT, EnvironmentWithApiUrl } from '@plastik/core/environments';
import { Observable, throwError } from 'rxjs';

@Injectable()
export abstract class BaseDataService {
  protected readonly environment = inject(ENVIRONMENT) as EnvironmentWithApiUrl;

  /**
   * Cache time by default (1 day). Children can override it.
   */
  protected cacheTime = 1000 * 60 * 60 * 24;

  /**
   * @description Generic error handler for HTTP and custom backends.
   * @param { unknown } error The error object.
   * @returns { Observable<never> } An observable that throws the formatted error.
   */
  public handleError<E = unknown>(error: E): Observable<never> {
    let message = 'An error occurred';
    let code = 500;
    let data: unknown = null;

    if (error instanceof HttpErrorResponse) {
      message = (error.error?.message ?? error.message) || message;
      code = error.status ?? code;
      data = error.error ?? null;
    } else if (typeof error === 'object' && error !== null) {
      const maybe = error as { message?: unknown; status?: unknown; data?: unknown };
      const dataMessage = (maybe.data as { message?: unknown } | undefined)?.message;
      message =
        (typeof dataMessage === 'string'
          ? dataMessage
          : typeof maybe.message === 'string'
            ? maybe.message
            : undefined) ?? message;
      code = typeof maybe.status === 'number' ? maybe.status : code;
      data = 'data' in maybe ? maybe.data : data;
    }

    return throwError(() => ({ message, code, data, originalError: error }));
  }
}
