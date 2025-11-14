import { catchError, map, Observable } from 'rxjs';

import { IdType } from '@plastik/core/entities';
import { HttpBaseService } from './http-base.service';

/**
 * @description Abstract class to inherit from on creating a feature api service.
 * @template T, P, E
 *
 * **T** refers to the main feature model item used inside applications.
 *
 * **P** refers to the type description of the passed parameters to API call methods.
 * These parameters are the usual option to pass configuration with the REST call, for example for filtering results, paginate or ordering data.
 *
 * **E** refers to the environment type extension with the API URL property.
 */
export abstract class HttpUpdateService<TEntity, ID = IdType<TEntity>> extends HttpBaseService {
  protected mapItemResponse(data: unknown): TEntity {
    return data as TEntity;
  }

  update(id: ID, data: Partial<TEntity>, options?: unknown): Observable<TEntity> {
    void options;
    return this.httpClient.patch(`${this.apiUrl}/${id}`, data).pipe(
      map(response => this.mapItemResponse(response)),
      catchError(this.handleError)
    );
  }
}
