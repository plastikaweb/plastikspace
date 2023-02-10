import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { NasaImagesSearch } from '@plastik/nasa-images/entities';

import { NasaImagesApiService } from './nasa-images-api.service';
import { createDummyNasaImagesSearch, createDummyNasaImagesSearchApiResponse } from './nasa-images.mock';

describe('NasaImagesApiService', () => {
  let service: NasaImagesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideEnvironmentMock(), NasaImagesApiService],
    });
    service = TestBed.inject(NasaImagesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a method `getList` that handles the API call that returns NASA images', () => {
    let imagesSearch: NasaImagesSearch | undefined;

    service.getList({ q: 'pluto' }).subscribe(response => {
      imagesSearch = response;
    });

    const req = httpMock.expectOne('https://api/search?q=pluto');

    expect(req.request.method).toBe('GET');
    req.flush(createDummyNasaImagesSearchApiResponse());
    httpMock.verify();

    expect(imagesSearch).toStrictEqual(createDummyNasaImagesSearch());
  });
});
