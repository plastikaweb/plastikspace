import { HttpClient } from '@angular/common/http';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { Params } from '@angular/router';
import { BaseDataService } from '@plastik/core/api-base';
import { BaseEntity } from '@plastik/core/entities';
import { HttpCrudService } from './http-crud.service';
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
export abstract class HttpBaseService extends BaseDataService {
  readonly httpClient = inject(HttpClient);
  readonly apiUrl: string;
  private readonly injector = inject(Injector);

  constructor() {
    super();
    this.apiUrl = `${this.getApiUrlFromEnvironment()}/${this.resourceUrlSegment()}`;
  }

  /**
   * @description Gets the API URL from the environment. Override if your environment uses a different property name.
   * @returns {string} The base API URL.
   */
  protected getApiUrlFromEnvironment(): string {
    return this.environment.baseApiUrl;
  }

  /**
   * @description Implement this method in child classes to have the feature resource URL segment name.
   * @returns {string} The resource URL segment.
   */
  protected abstract resourceUrlSegment(): string;

  /**
   * @description Method to map the API list response with the inner typings before storing it in app.
   * Override this method in child classes when inheriting from ApiService with your custom API response structures.
   * @param { unknown } data The API response data as it is.
   * @returns { unknown } The mapped API response.
   */
  protected mapListResponse(data: unknown): unknown {
    return data;
  }

  /**
   * @description Method to map the API item response with the inner typings before storing it in app.
   * Override this method in child classes when inheriting from ApiService with your custom API response structures.
   * @param { unknown } data The API response data as it is.
   * @returns { unknown } The mapped API response.
   */
  protected mapItemResponse(data: unknown): unknown {
    return data;
  }

  /**
   * @description Creates a HttpCrudService instance with the correct resource URL segment and mappers.
   * @returns {HttpCrudService} The service instance.
   * @private
   */
  protected createHttpCrudService<
    T extends BaseEntity,
    TListResult = T[],
    PARAMS extends Params = Params,
  >(): HttpCrudService<T, TListResult, PARAMS> {
    const resourceUrlSegment = this.resourceUrlSegment();

    const mapListResponse = (data: unknown): TListResult =>
      this.mapListResponse(data) as TListResult;

    const mapItemResponse = (data: unknown): T => this.mapItemResponse(data) as T;

    return runInInjectionContext(this.injector, () => {
      const ServiceClass = class extends HttpCrudService<T, TListResult, PARAMS> {
        protected override resourceUrlSegment(): string {
          return resourceUrlSegment;
        }
        protected override mapListResponse(data: unknown): TListResult {
          return mapListResponse(data);
        }
        protected override mapItemResponse(data: unknown): T {
          return mapItemResponse(data);
        }
      };
      return new ServiceClass();
    });
  }
}
