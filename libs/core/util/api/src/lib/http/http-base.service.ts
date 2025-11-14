import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { BaseDataService } from '../base-data.service';

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
}
