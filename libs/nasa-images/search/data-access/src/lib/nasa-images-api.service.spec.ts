import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';

import { provideHttpClient } from '@angular/common/http';
import { NasaImagesApiService } from './nasa-images-api.service';
import { createDummyNasaImagesSearch, createDummyNasaImagesSearchApiResponse } from './nasa-images.mock';

describe('NasaImagesApiService', () => {
  let service: NasaImagesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideEnvironmentMock(), provideHttpClient(), provideHttpClientTesting(), NasaImagesApiService],
    });
    service = TestBed.inject(NasaImagesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a method `getList` that handles the API call that returns NASA images', done => {
    service.getList({ q: 'pluto' }).subscribe(response => {
      expect(response).toStrictEqual(createDummyNasaImagesSearch());
      done();
    });

    const req = httpMock.expectOne({ method: 'GET', url: 'https://api/search?q=pluto' });

    req.flush(createDummyNasaImagesSearchApiResponse());
    httpMock.verify();
  });
});
