import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideEnvironmentWithApiMock } from '@plastik/core/environments/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { NasaImagesApiService } from './nasa-images-api.service';
import {
  createDummyNasaImagesSearch,
  createDummyNasaImagesSearchApiResponse,
} from './nasa-images.mock';

describe('NasaImagesApiService', () => {
  let service: NasaImagesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideEnvironmentWithApiMock(),
        provideHttpClient(),
        provideHttpClientTesting(),
        NasaImagesApiService,
      ],
    });
    service = TestBed.inject(NasaImagesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a method `getList` that handles the API call that returns NASA images', () => {
    let response;
    service.getList({ q: 'pluto' }).subscribe(res => (response = res));

    const req = httpMock.expectOne({ method: 'GET', url: 'https://api/search?q=pluto' });

    req.flush(createDummyNasaImagesSearchApiResponse());
    expect(response).toStrictEqual(createDummyNasaImagesSearch());
    httpMock.verify();
  });
});
