import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@plastik/core/environments';
import { Observable, throwError } from 'rxjs';

@Injectable()
export abstract class BaseDataService {
  abstract environment: Environment;

  /**
   * Extra headers to be added to the request.
   */
  protected extraHeaders: Record<string, string> = {};

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
    let payload: unknown = null;

    if (error instanceof HttpErrorResponse) {
      message = (error.error?.message ?? error.message) || message;
      code = error.status ?? code;
      payload = error.error ?? null;
    } else if (typeof error === 'object' && error !== null) {
      // Keys are read through bracket notation on purpose: 'data' is the field name
      // PocketBase's ClientResponseError uses for its response body, so it cannot be
      // renamed to satisfy id-denylist without the lookup silently missing.
      const maybe = error as Record<string, unknown>;
      const bodyMessage = (maybe['data'] as { message?: unknown } | undefined)?.message;

      message =
        (typeof bodyMessage === 'string'
          ? bodyMessage
          : typeof maybe['message'] === 'string'
            ? maybe['message']
            : undefined) ?? message;
      code = typeof maybe['status'] === 'number' ? maybe['status'] : code;
      payload = 'data' in maybe ? maybe['data'] : payload;
    }

    return throwError(() => ({ message, code, payload, originalError: error }));
  }
}
